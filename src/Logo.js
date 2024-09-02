import React from 'react';
import myimage from "./images/profile-pic (2).png" ;

function Logo() {
    return (
        <div style={{
            borderRadius: '50%',
            overflow: 'hidden',
            width: '100px',
            height: '100px',
            backgroundColor: '#ffffff'
        }}>
            <img src={myimage} alt="Bavajann" style={{ width: '100%', height:'100%' }} />

        </div>
    );
}

export default Logo;
