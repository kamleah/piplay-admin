// TestShare
import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import './AppShare.css';
import image from "../../assets/image/Picture1.png"
import image2 from "../../assets/image/Picture0.png"

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

const TestShare = () => {
    let query = useQuery();
    let postId = query.get("postId");

    useEffect(() => {
        // const OSplatform = navigator.userAgent;
        // try {
        //     window.location.href = `com.padelplay.piplay://Home`;
        //     setTimeout(() => {
        //         if (OSplatform.includes('Windows') || OSplatform.includes('Linux')) {
        //             setTimeout("window.location = 'https://play.google.com/store/apps/details?id=com.padelplay.piplay';", 2000);
        //         } else if (OSplatform.includes('Macintosh') || OSplatform.includes('iPhone')) {
        //             setTimeout("window.location = 'https://apps.apple.com/in/app/pi-play/id6451375568';", 2000);
        //         } else {
        //             setTimeout("window.location = 'https://play.google.com/store/apps/details?id=com.padelplay.piplay';", 2000);
        //         }
        //     }, 5000);
        // } catch (error) {
        //     console.log("Errror");
        // }
    }, []);

    return (
        <div className="main-sec">
            <div className="logo-sec">                
                <img className="logo" src={image} alt="" />
                <div className="inner-container">
                        <h2 className="little-content">
                            <span className="some-word">
                                Pi Play  
                            </span>
                                for android and ios
                        </h2>
                        <h3>Download our app</h3>
                        <div className="png-container">
                            <a href="https://play.google.com/store/apps/details?id=com.padelplay.piplay">
                                <img
                                    src="https://justpadel-courtimages.s3.amazonaws.com/android.png"
                                    alt="android.png"
                                    width="200"
                                    height="70"
                                />
                            </a>
                            <a href="https://apps.apple.com/in/app/pi-play/id6451375568">
                                <img
                                    src="https://justpadel-courtimages.s3.amazonaws.com/apple.jpg"
                                    alt="android.png"
                                    width="200"
                                    height="62"
                                />
                            </a>
                        </div>
                    </div>
            </div>            
        </div>
    );
};

export default TestShare;