from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken
from .serializers import RegisterSerializer, UserSerializer, LoginSerializer
from django.contrib.auth import authenticate
from edesia_main.users.models import User
from edesia_main.staff.models import StaffDetail

from allauth.account.models import EmailAddress, EmailConfirmation
from allauth.account.managers import EmailAddressManager
from django.conf import settings
from django.db import IntegrityError

# Registration API
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        # try:
        # request.data['name'] = "admin"

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
        {"user": UserSerializer(user, context=self.get_serializer_context()).data,
        "token": AuthToken.objects.create(user)}
        )
        # except Exception as e:
        #     print(e)
        #     return Response({"Error":"Error"})

# Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            Data = request.data

            if Data and Data['email'] is not None and Data['password'] is not None:
                userdata = User.objects.get(email=Data['email'], is_active=True)
                print(userdata)
                if userdata.check_password(Data['password']):
                    # userdata = authenticate(email=Data['email'], password=Data['password'])
                    print(userdata, Data['email'])
                    if userdata is not None:
                        if userdata.is_active:
                            token = AuthToken.objects.create(userdata)
                            return Response(
                            {"status": "success", "message": "Successfully Login",
                            "user": {"username": userdata.username, "email": userdata.email, "password": userdata.password},
                            "token": token[1]},
                            status=status.HTTP_200_OK
                            )
                        else:
                            return Response(
                            {"status": "error", "message": "User not active"},
                            status=status.HTTP_422_UNPROCESSABLE_ENTITY
                            )
                    else:
                        return Response(
                        {'status': "error", "message": "Wrong Credentials or User not Registerd"},
                        status=status.HTTP_422_UNPROCESSABLE_ENTITY
                        )
                else:
                    return Response(
                    {'status': "error", "message": "Wrong Credentials or User not Registerd"},
                    status=status.HTTP_422_UNPROCESSABLE_ENTITY
                    )
            return Response(
            {'status': "error", "message": "Email and Password is required"},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )
        except User.DoesNotExist:
            return Response(
            {'status': "error", "message": "User Not registered or InActive please contact to admin"},
            status=status.HTTP_422_UNPROCESSABLE_ENTITY
            )

# Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def get(self, request):
        userdata = self.request.user

        emails = EmailAddress.objects.filter(user=userdata)
        userdetail = []
        if emails is not None:
            for email in emails:
                userdetail.append({
                    "email": email.email,
                    "verified": email.verified
                })

        user = {
            "username": userdata.username,
            "email": userdata.email,
            "password": userdata.password,
            "is_restaurant": not userdata.restaurant_staff,
            "staffs": userdetail
        }

        return Response({"status": "successful", "message": "User Get Successfully", "user": user}, status=status.HTTP_200_OK)

    # def get_object(self):
    #     user = self.request.user
    #     print(user)
    #     return user


# Cange Password API
class ChangePasswordAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        userdata = request.data
        currentuser = self.request.user
        print(userdata)

        if(userdata['newpassword'] is not None and userdata['new_confirm_password'] is not None):
            newpassword = userdata['newpassword']
            newconfirmpassword = userdata['new_confirm_password']
            if newpassword == newconfirmpassword:

                currentuser.set_password(newpassword)
                currentuser.save()
                user = {
                    "username": currentuser.username,
                    "email": currentuser.email
                }
                return Response({"status": "successful", "message": "Change Password Successfully", "user": user}, status=status.HTTP_200_OK)
            else:
                return Response({"status": "error", "message": "Password and Confirm password not match"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            return Response({"status": "error", "message": "All field required"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

    # def get_object(self):
    #     user = self.request.user
    #     print(user)
    #     return user

# Send Invitation API
class SendInvitationAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]

    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):

        currentuser = self.request.user
        print(currentuser)
        emails = EmailAddress.objects.filter(user=currentuser)
        userdetail = []
        if emails is not None:
            for email in emails:
                userdetail.append({
                    "email": email.email,
                    "verified": email.verified
                })

        return Response({"status": "success", "message": "User fetch", "user": userdetail}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            userdata = request.data
            currentuser = self.request.user

            if(userdata['email'] is not None and userdata['first_name'] is not None and userdata['last_name'] is not None and userdata['phonenumber'] is not None):
                email_address, created = EmailAddress.objects.get_or_create(
                    user=currentuser, email=userdata['email'], defaults={"email": userdata['email']})
                if created:
                    usernewdata = User.objects.create(
                        first_name=userdata['first_name'], last_name=userdata['last_name'], email=userdata['email'], restaurant_staff=currentuser)
                    StaffDetail.objects.create(user=usernewdata)
                    email_address.send_confirmation(request, signup=False)
                    return Response({"status": "success", "message": "Email Confirmation send"}, status=status.HTTP_201_CREATED)
                else:
                    return Response({"status": "error", "message": "Email address already registered"}, status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                return Response({"status": "error", "message": "All field required"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        except IntegrityError as e:

            return Response({"status": "error", "message": "Email already exist"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            print(e)
            return Response({"status": "error", "message": "Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Staff Registration API
class StaffRegistrationAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        try:
            currentuser = self.request.user
            Data = request.data
            print(Data)
            staffdetails = StaffDetail.objects.get(user=currentuser)
            # staffdetails.phonenumber = Data['phonenumber']
            staffdetails.profile_photo = Data['profile_photo']
            staffdetails.save()
            return Response({"status": "success", "message": "Staff Data Successfully Updated"}, status=status.HTTP_200_OK)
        except StaffDetail.DoesNotExist:
            # User Model
            usercurrentdate = User.objects.get(id=currentuser.id)
            usercurrentdate.first_name = Data['firstname']
            usercurrentdate.last_name = Data['lastname']
            usercurrentdate.save()
            # StaffDetails Model
            staffdetails = StaffDetail.objects.create(nationality=Data['nationality'] or '', phonenumber=Data['phonenumber'], businessname=Data['businessname'], taxnumber=Data['taxnumber'], country=Data['country'], city=Data['city'], zip_code=Data['zip_code'], street=Data['street'],
                                                      street_details=Data['street_details'], profile_photo=Data['profile_photo'], restaurant_cover_photo=Data['restaurant_cover_photo'], restaurant_contact_person=Data['restaurant_contact_person'], business_certificate=Data['business_certification'], user=currentuser)
            return Response({"status": "success", "message": "Staff Data Successfully Created"}, status=status.HTTP_201_CREATED)
            # return Response({'status': "error", "message": "User Not registered or InActive please contact to admin"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
