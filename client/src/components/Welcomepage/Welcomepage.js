import React from 'react';
import {Link} from 'react-router-dom'
export const Welcomepage = () => {
    
    return(
        <div style={{
            marginTop: '10%',
            marginLeft: '15%',
            marginRight: '15%',
            marginBottom: '40%',
            // height: '100%',
            alignItems:'center',
            background: 'white',
            padding: '2%',
            overflow: 'auto',
            // marginTop: '15%',
            minWidth: '450px'
        }}>

            <h1 className='ui aligned center header'>
                Welcome to BlogStation amigo!!  
            </h1>
            <div >
                <Link to='/home'> Navigate to Homepage </Link>
            </div>
        </div>
    )
}