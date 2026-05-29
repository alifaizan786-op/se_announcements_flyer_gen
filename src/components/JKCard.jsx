import { fmtDate } from '../utils/fmtDate';
import IconBubble from './IconBubble';

const GOTHAM =
    "'Gotham', 'Montserrat', 'Century Gothic', 'Gill Sans', sans-serif";

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';

// ── JK Card ───────────────────────────────────────────────────────────────────
//
// Differences from FullWidthCard:
//  • Left date badge (green square with day + month) instead of gold left border
//  • No jamatkhanas label — redundant when the whole flyer belongs to one JK
//  • Slightly tighter font sizes to accommodate the badge width
//  • Falls back to a slim gold bar when no date is set
//
export default function JKCard({ ann }) {
    const ds = fmtDate(ann.date, ann.time, ann.timezone);

    // Parse date for badge display
    const dateObj = ann.date ? new Date(ann.date + 'T00:00:00') : null;
    const dayNum = dateObj ? dateObj.getDate() : null;
    const monthStr = dateObj
        ? dateObj
              .toLocaleString('default', { month: 'short' })
              .toUpperCase()
        : null;

    return (
        <div
            style={{
                background: 'white',
                borderRadius: 5,
                padding: '10px 14px',
                display: 'flex',
                gap: 12,
                alignItems: 'center',
                boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                border: '1px solid #e5e2d8',
                borderTop: `3px solid ${FLYER_GOLD}`,
                fontFamily: GOTHAM,
            }}>

            {/* Date badge — or fallback gold bar */}
            {dateObj ? (
                <div
                    style={{
                        flexShrink: 0,
                        width: 46,
                        alignSelf: 'stretch',
                        background: FLYER_HDR,
                        borderRadius: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '6px 4px',
                        color: 'white',
                        minHeight: 50,
                    }}>
                    <span
                        style={{
                            fontSize: 24,
                            fontWeight: 700,
                            lineHeight: 1,
                            fontFamily: GOTHAM,
                        }}>
                        {dayNum}
                    </span>
                    <span
                        style={{
                            fontSize: 8.5,
                            letterSpacing: 1.2,
                            fontWeight: 600,
                            marginTop: 3,
                            fontFamily: GOTHAM,
                            opacity: 0.75,
                        }}>
                        {monthStr}
                    </span>
                </div>
            ) : (
                <div
                    style={{
                        flexShrink: 0,
                        width: 4,
                        alignSelf: 'stretch',
                        background: FLYER_GOLD,
                        borderRadius: 2,
                    }}
                />
            )}

            {/* Icon bubble */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconBubble iconUrl={ann.iconUrl} bgColor={ann.iconBg} size={40} />
            </div>

            {/* Text content */}
            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}>
                {/* Title — no JK labels */}
                <div
                    style={{
                        fontWeight: 700,
                        fontSize: 17,
                        color: '#1a1a1a',
                        letterSpacing: 0.3,
                        lineHeight: 1.25,
                        fontVariant: 'small-caps',
                        fontFamily: GOTHAM,
                    }}>
                    {ann.title}
                </div>

                {/* Description */}
                <div
                    style={{
                        fontSize: 11,
                        color: '#555',
                        lineHeight: 1.5,
                        fontFamily: GOTHAM,
                    }}
                    dangerouslySetInnerHTML={{ __html: ann.description }}
                />

                {/* When / Where */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {ds && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 3,
                            }}>
                            <span
                                style={{
                                    color: '#999',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 0.3,
                                    fontFamily: GOTHAM,
                                }}>
                                When:
                            </span>
                            <span
                                style={{
                                    color: FLYER_HDR,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 0.3,
                                    fontFamily: GOTHAM,
                                }}>
                                {ds}
                            </span>
                        </div>
                    )}
                    {ann.venue && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: 3,
                            }}>
                            <span
                                style={{
                                    color: '#999',
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 0.3,
                                    fontFamily: GOTHAM,
                                }}>
                                Where:
                            </span>
                            <span
                                style={{
                                    color: FLYER_HDR,
                                    fontSize: 10,
                                    fontWeight: 700,
                                    letterSpacing: 0.3,
                                    fontFamily: GOTHAM,
                                }}>
                                {ann.venue}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}