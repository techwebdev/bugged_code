import React, { useState } from 'react';
import { Helmet } from 'react-helmet';


const Home = () => {

    return (
        <main className='home'>
            <Helmet>
                <title>Edesia - Home</title>
                <meta
                    name='description'
                    content='Edesia Home Page'
                />
            </Helmet>
        </main>
    );
};

export default Home;
