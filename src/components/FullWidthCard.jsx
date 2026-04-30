import { fmtDate } from '../utils/fmtDate';
import IconBubble from './IconBubble';

const GOTHAM =
	"'Gotham', 'Montserrat', 'Century Gothic', 'Gill Sans', sans-serif";

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Full-Width Card ────────────────────────────────────────────────────────────
export default function FullWidthCard({ ann }) {
	const ds = fmtDate(ann.date, ann.time, ann.timezone);
	console.log(`${ann.title}`, { ds });
	return (
		<div
			style={{
				background: 'white',
				borderRadius: 5,
				padding: '11px 14px',
				display: 'flex',
				gap: 12,
				alignItems: 'center',
				boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
				border: '1px solid #e5e2d8',
				borderLeft: `4px solid ${FLYER_GOLD}`,
				fontFamily: GOTHAM,
			}}>
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<IconBubble iconUrl={ann.iconUrl} bgColor={ann.iconBg} size={42} />
			</div>
			<div
				style={{
					flex: 1,
					minWidth: 0,
					display: 'flex',
					flexDirection: 'column',
					gap: 4,
				}}>
				<div
					style={{
						fontWeight: 700,
						fontSize: 18,
						color: '#1a1a1a',
						letterSpacing: 0.3,
						lineHeight: 1.25,
						fontVariant: 'small-caps',
						fontFamily: GOTHAM,
					}}>
					{ann.jamatkhanas.length > 0 && (
						<>
							<span
								style={{
									fontSize: 9.5,
									color: '#999',
									lineHeight: 1.4,
								}}>
								{ann.jamatkhanas.join(' • ')}
							</span>
							<br />
						</>
					)}
					{ann.title}
				</div>
				<div
					style={{
						fontSize: 11.5,
						color: '#555',
						lineHeight: 1.5,
						fontFamily: GOTHAM,
					}}
					dangerouslySetInnerHTML={{ __html: ann.description }}
				/>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: 3,
					}}>
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
									fontSize: 10.5,
									fontWeight: 700,
									letterSpacing: 0.3,
									fontFamily: GOTHAM,
								}}>
								When:
							</span>
							<span
								style={{
									color: FLYER_HDR,
									fontSize: 10.5,
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
									fontSize: 10.5,
									fontWeight: 700,
									letterSpacing: 0.3,
									fontFamily: GOTHAM,
								}}>
								Where:
							</span>
							<span
								style={{
									color: FLYER_HDR,
									fontSize: 10.5,
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
