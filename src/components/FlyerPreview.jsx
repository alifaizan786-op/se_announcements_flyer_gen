import FullWidthCard from './FullWidthCard';

const GOTHAM =
	"'Gotham', 'Montserrat', 'Century Gothic', 'Gill Sans', sans-serif";


// ── Flyer Preview ──────────────────────────────────────────────────────────────

const LETTER_W = 680;
const LETTER_H = 880;

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

export default function FlyerPreview({
    announcements,
    headerTitle,
    headerSubtitle,
    footerUrl,
    bodyRef,
}) {
    return (
        <div
            style={{
                width: LETTER_W,
                height: LETTER_H,
                background: FLYER_BG,
                fontFamily: GOTHAM,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
            }}>
            <div
                style={{
                    background: FLYER_HDR,
                    padding: '18px 28px 14px',
                    textAlign: 'center',
                    flexShrink: 0,
                }}>
                <div
                    style={{
                        color: 'white',
                        fontSize: 30,
                        fontWeight: 600,
                        letterSpacing: 2,
                        textTransform: 'uppercase',
                        fontFamily: GOTHAM,
                    }}>
                    {headerTitle || 'LOCAL ANNOUNCEMENTS'}
                </div>
                <div
                    style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 10,
                        letterSpacing: 4,
                        textTransform: 'uppercase',
                        marginTop: 4,
                        fontFamily: GOTHAM,
                        fontWeight: 600,
                    }}>
                    {headerSubtitle || 'MARCH – APRIL 2026'}
                </div>
            </div>
            <div
                style={{
                    background: `linear-gradient(
    180deg,
    #f8ecd3 0%,
    #e8d2a0 100%
  )`,
                    borderTop: '2px solid #cfa96b',
                    borderBottom: '2px solid #cfa96b',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                    padding: '5px 20px',
                    textAlign: 'center',
                    color: '#404040',
                    marginTop: '8px',
                    lineHeight: '27px',
                }}>
                <small
                    style={{
                        display: 'block',
                        fontSize: '18px',
                        marginTop: '4px',
                        opacity: 0.9,
                        fontFamily: GOTHAM,
                        fontWeight: 600,
                    }}>
                    Multifaith family members are warmly welcomed.
                </small>
                <span
                    style={{
                        display: 'block',

                        fontSize: '16px',
                        letterSpacing: '0.2px',
                        fontFamily: GOTHAM,
                    }}>
                    For More Information — Visit{' '}
                </span>
                <span
                    style={{
                        fontFamily: GOTHAM,
                        color: '#1a344f',
                        fontWeight: 600,
                        textDecoration: 'underline',
                    }}>
                    {footerUrl ||
                        'https://prime.southeastcouncil.com/news-feed-southeast'}
                </span>
            </div>
            <div
                ref={bodyRef}
                style={{
                    flex: 1,
                    overflow: 'hidden',
                    padding: '6px 16px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-evenly',
                    gap: 7,
                }}>
                {announcements.length === 0 ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '40px 0',
                            color: '#aaa',
                            fontSize: 13,
                            fontFamily: GOTHAM,
                        }}>
                        No announcements yet. Add one using the form.
                    </div>
                ) : (
                    announcements.map((ann) => <FullWidthCard key={ann.id} ann={ann} />)
                )}
            </div>
        </div>
    );
}
