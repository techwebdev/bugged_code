from allauth.account.app_settings import EMAIL_CONFIRMATION_EXPIRE_DAYS
from allauth.account.models import EmailAddress
from django.core import signing
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from knox.models import AuthToken

from edesia_main.users.models import User
redirecturl = settings.AFTER_CONFIRMATION_REDIRECT_URL

# from allauth.account.models from email
# from allauth.account.decorators from app_settings

class UserCreateView(APIView):
    def post(self, request, format='json'):
        try:
            data = request.data
            data['is_superuser'] = False
            data['is_staff'] = True
            data['is_active'] = True
            data['is_staff'] = True

            # print(data)
            emaildata = EmailAddress.objects.get(email=data['email'])
            # print(emaildata.user.is_superuser)
            # print(emaildata.user.is_staff)
            # print(emaildata.user.restaurant_staff)
            if emaildata.user.restaurant_staff is None and emaildata.user.is_staff:
                data['restaurant_staff'] = emaildata.user

            if emaildata:
                if emaildata.user.is_active:
                    emaildata = EmailAddress.objects.get(email=data['email'])
                    print(emaildata.verified)
                    if emaildata.verified:
                        if data['confirm_password'] == data['password']:
                            del data['confirm_password']
                            if not (User.objects.filter(username=data['username']).exists() or User.objects.filter(email=data['email']).exists()):
                                userdata = User.objects.create(**data)
                                userdata.set_password(userdata.password)
                                userdata.save()
                                if userdata:
                                    token = AuthToken.objects.create(userdata)
                                    # print(token)
                                    return Response({'status': 'success', "message": "User Created Successfully", "user": {"username": userdata.username, "email": userdata.email, "password": userdata.password}, "token": token[1]}, status=status.HTTP_201_CREATED)
                                else:
                                    return Response({'status': 'Error', "message": "User not created"}, status=status.HTTP_411_LENGTH_REQUIRED)
                            else:
                                userdata = User.objects.get(email=data['email'])
                                # print(data)
                                # print(userdata.id, userdata.email)
                                # print(data['restaurant_staff'] is not None)
                                # print(userdata.password == "")
                                # print(userdata.username == "")
                                # print(userdata.first_name is not None)
                                # print(userdata.last_name is not None)
                                if data['restaurant_staff'] is not None and userdata.password == "" and userdata.username == "" and userdata.first_name is not None and userdata.last_name is not None:
                                    userdata.username = data['username']
                                    userdata.is_active = data['is_active']
                                    userdata.is_superuser = data['is_superuser']
                                    userdata.is_staff = data['is_staff']
                                    userdata.is_staff = data['is_staff']
                                    userdata.restaurant_staff = data['restaurant_staff']
                                    userdata.set_password(data['password'])
                                    userdata.save()
                                    if userdata:
                                        token = AuthToken.objects.create(userdata)
                                        print(token)
                                        return Response({'status': 'success', "message": "User Created Successfully", "user": {"username": userdata.username, "email": userdata.email, "password": userdata.password}, "token": token[1]}, status=status.HTTP_201_CREATED)

                                else:
                                    return Response({'status': 'Error', "message": "Username or Email Allready Exist"}, status=status.HTTP_400_BAD_REQUEST)
                        else:
                            return Response({'status': 'Error', "message": "Password and Confirm Password not match"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                    else:
                        return Response({'status': 'Error', "message": "Email Not Verified"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                else:
                    return Response({'status': 'Error', "message": "Restaurant is not active"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            else:
                return Response({'status': 'Error', "message": "Email not found please contact to Admin"}, status=status.HTTP_404_NOT_FOUND)
        except EmailAddress.DoesNotExist:
            return Response({'status': 'Error', "message": "Email not found please contact to Admin"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print("ERRRR", e)
            return Response({'status': 'Error', "message": "Internal Server Error"}, status=status.HTTP_400_BAD_REQUEST)


@api_view()
def confirmUrl(request, **kwargs):
    try:
        key = kwargs['key']
        max_age = EMAIL_CONFIRMATION_EXPIRE_DAYS
        print("max_age", max_age)
        fromkey = signing.loads(key, max_age=max_age, salt='account')
        emaildata = EmailAddress.objects.get(pk=fromkey)
        if(emaildata.verified):
            detail = {"message": "Already Verifyed", "already_Verify": True, "status_code": 200}
            return redirect('{}?{}={}'.format(redirecturl, "email", emaildata.email))
        emaildata.verified = True
        emaildata.save()
        detail = {"message": "Verified Succefuly", "is_verify": True, "status_code": 200}

        return redirect('{}?{}={}'.format(redirecturl, "email", emaildata.email))
    except (signing.SignatureExpired, signing.BadSignature, EmailAddress.DoesNotExist):

        detail = {"message": "Token Expired", "error": True, "status_code": 400}
        return Response(detail)
