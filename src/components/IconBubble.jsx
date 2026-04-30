

import * as LucideIcons from 'lucide-react';
const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
    LucideIcons;

    
export default function IconBubble({ iconUrl, bgColor, size = 42 }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: '50%',
                background: bgColor || '#005D35',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                overflow: 'hidden',
            }}>
            {iconUrl ? (
                <img
                    src={iconUrl}
                    alt=''
                    style={{
                        width: '70%',
                        height: '70%',
                        objectFit: 'contain',
                        filter: 'brightness(0) invert(1)',
                    }}
                />
            ) : (
                <Upload
                    size={Math.round(size * 0.35)}
                    color='rgba(255,255,255,0.5)'
                    strokeWidth={1.8}
                />
            )}
        </div>
    );
}
