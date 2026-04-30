import * as LucideIcons from 'lucide-react';
import {
    useRef,
    useState
} from 'react';
import IconBubble from './IconBubble';
const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
    LucideIcons;

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Icon Upload ────────────────────────────────────────────────────────────────

export default function IconUpload({ iconUrl, bgColor, onChange }) {
    const inputRef = useRef(null);
    const [dragging, setDragging] = useState(false);

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const d = imageData.data;
                for (let i = 0; i < d.length; i += 4) {
                    if (d[i + 3] > 10) {
                        d[i] = 255;
                        d[i + 1] = 255;
                        d[i + 2] = 255;
                    }
                }
                ctx.putImageData(imageData, 0, 0);
                onChange(canvas.toDataURL('image/png'));
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div>
            <div
                onClick={() => inputRef.current.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFile(e.dataTransfer.files[0]);
                }}
                style={{
                    border: `2px dashed ${dragging ? FLYER_HDR : '#d0ccc4'}`,
                    borderRadius: 8,
                    padding: '12px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: 'pointer',
                    background: dragging ? '#f0f7f4' : 'white',
                    transition: 'all 0.15s',
                }}>
                <IconBubble iconUrl={iconUrl} bgColor={bgColor} size={44} />
                <div style={{ flex: 1 }}>
                    {iconUrl ? (
                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: FLYER_HDR,
                            }}>
                            Icon uploaded
                        </div>
                    ) : (
                        <div
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#888',
                            }}>
                            Click or drag to upload
                        </div>
                    )}
                    <div style={{ fontSize: 10.5, color: '#bbb', marginTop: 2 }}>
                        PNG, SVG, JPG — white/transparent works best
                    </div>
                </div>
                {iconUrl && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange(null);
                        }}
                        style={{
                            background: '#fef2f2',
                            border: '1px solid #f5c6c6',
                            borderRadius: 5,
                            color: '#c0392b',
                            cursor: 'pointer',
                            padding: '4px 7px',
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                        }}>
                        <X size={12} strokeWidth={2.5} />
                    </button>
                )}
            </div>
            <input
                ref={inputRef}
                type='file'
                accept='image/*'
                style={{ display: 'none' }}
                onChange={(e) => handleFile(e.target.files[0])}
            />
        </div>
    );
}