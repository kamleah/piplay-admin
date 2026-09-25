import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function SharePosts() {
    const { sharePostsId } = useParams();
    useEffect(() => {
        const OSplatform = navigator.userAgent;
        try {
            window.location.href = `com.padelplay.piplay://feed/${sharePostsId}`;
            setTimeout(() => {
                if (OSplatform.includes('Windows') || OSplatform.includes('Linux')) {
                    setTimeout("window.location = 'https://play.google.com/store/apps/details?id=com.padelplay.piplay';", 2000);
                } else if (OSplatform.includes('Macintosh') || OSplatform.includes('iPhone')) {
                    setTimeout("window.location = 'https://apps.apple.com/in/app/pi-play/id6451375568';", 2000);
                } else {
                    setTimeout("window.location = 'https://play.google.com/store/apps/details?id=com.padelplay.piplay';", 2000);
                }
            }, 5000);
        } catch (error) {
            console.log("Errror");
        }
    }, []);
  return (
    <div>
      <h2>Share Post</h2>
    </div>
  )
}
