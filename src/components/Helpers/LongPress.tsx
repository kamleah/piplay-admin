import React, { useState, useRef, useEffect } from 'react';

interface LongPressProps {
    onLongPress: () => void;
    children: React.ReactNode;
    delay?: number;
}

const LongPressDiv: React.FC<LongPressProps> = ({
    onLongPress,
    children,
    delay = 300, // default delay for long press in milliseconds
}) => {
    const [isLongPress, setIsLongPress] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        return () => {
            // Clean up timeout if component unmounts
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const startPress = () => {
        timeoutRef.current = setTimeout(() => {
            setIsLongPress(true);
            onLongPress();
        }, delay);
    };

    const cancelPress = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (!isLongPress) {
        }
        setIsLongPress(false);
    };

    return (
        <div
            onMouseDown={startPress}
            onMouseUp={cancelPress}
            onMouseLeave={cancelPress}
            onTouchStart={startPress}
            onTouchEnd={cancelPress}
        >
            {children}
        </div>
    );
};

export default LongPressDiv;
