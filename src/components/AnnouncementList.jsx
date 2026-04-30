import * as LucideIcons from 'lucide-react';
import { useState } from 'react';
import IconBubble from './IconBubble';

import { fmtDate } from '../utils/fmtDate';

const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
	LucideIcons;

const GOTHAM =
	"'Gotham', 'Montserrat', 'Century Gothic', 'Gill Sans', sans-serif";

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Announcement List ──────────────────────────────────────────────────────────
export default function AnnouncementList({
	announcements,
	onEdit,
	onDelete,
	onMoveUp,
	onMoveDown,
	onClearAll,
}) {
	const [confirmClear, setConfirmClear] = useState(false);

	const handleClearAll = () => {
		if (confirmClear) {
			onClearAll();
			setConfirmClear(false);
		} else {
			setConfirmClear(true);
		}
	};

	if (!announcements.length)
		return (
			<div
				style={{
					textAlign: 'center',
					padding: '40px 20px',
					color: '#aaa',
					fontSize: 13,
				}}>
				No announcements yet.
			</div>
		);

	const arrowBtn = (disabled, onClick, icon) => (
		<button
			onClick={onClick}
			disabled={disabled}
			style={{
				width: 22,
				height: 22,
				border: `1px solid ${disabled ? '#eee' : '#d8d4cc'}`,
				borderRadius: 4,
				background: disabled ? '#fafafa' : 'white',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: disabled ? 'default' : 'pointer',
				padding: 0,
			}}>
			{icon}
		</button>
	);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
			{/* Clear all row */}
			<div
				style={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginBottom: 2,
				}}>
				{confirmClear ? (
					<div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
						<span style={{ fontSize: 11, color: '#888' }}>
							Remove all {announcements.length} items?
						</span>
						<button
							onClick={handleClearAll}
							style={{
								padding: '4px 10px',
								background: '#c0392b',
								color: 'white',
								border: 'none',
								borderRadius: 4,
								cursor: 'pointer',
								fontSize: 11,
								fontWeight: 700,
							}}>
							Yes, clear
						</button>
						<button
							onClick={() => setConfirmClear(false)}
							style={{
								padding: '4px 10px',
								background: 'white',
								color: '#666',
								border: '1px solid #ddd',
								borderRadius: 4,
								cursor: 'pointer',
								fontSize: 11,
							}}>
							Cancel
						</button>
					</div>
				) : (
					<button
						onClick={() => setConfirmClear(true)}
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: 5,
							padding: '5px 10px',
							background: 'white',
							color: '#c0392b',
							border: '1px solid #f5c6c6',
							borderRadius: 5,
							cursor: 'pointer',
							fontSize: 11,
							fontWeight: 600,
						}}>
						<Trash2 size={12} strokeWidth={2} />
						Clear All
					</button>
				)}
			</div>

			{announcements.map((ann, i) => {
				const ds = fmtDate(ann.date, ann.time);
				const isFirst = i === 0;
				const isLast = i === announcements.length - 1;

				return (
					<div
						key={ann.id}
						style={{
							background: 'white',
							border: '1px solid #e5e2d8',
							borderRadius: 7,
							padding: '10px 12px',
							display: 'flex',
							gap: 10,
							alignItems: 'flex-start',
						}}>
						<div
							style={{
								display: 'flex',
								flexDirection: 'column',
								gap: 2,
								flexShrink: 0,
								alignSelf: 'center',
							}}>
							{arrowBtn(
								isFirst,
								() => onMoveUp(i),
								<ChevronUp size={12} color={isFirst ? '#ccc' : '#666'} />,
							)}
							{arrowBtn(
								isLast,
								() => onMoveDown(i),
								<ChevronDown size={12} color={isLast ? '#ccc' : '#666'} />,
							)}
						</div>

						<IconBubble iconUrl={ann.iconUrl} bgColor={ann.iconBg} size={32} />

						<div style={{ flex: 1, minWidth: 0 }}>
							<div
								style={{
									fontWeight: 600,
									fontSize: 12.5,
									color: '#222',
									fontVariant: 'small-caps',
									lineHeight: 1.25,
								}}>
								{ann.title}
							</div>
							{ds && (
								<div
									style={{
										fontSize: 10.5,
										color: FLYER_HDR,
										marginTop: 2,
									}}>
									{ds} {ann.timezone}
								</div>
							)}
							{ann.venue && (
								<div
									style={{
										fontSize: 10.5,
										color: '#888',
										marginTop: 1,
									}}>
									{ann.venue}
								</div>
							)}
							<div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>
								{ann.jamatkhanas.length > 0
									? ann.jamatkhanas.join(', ')
									: 'All Jamatkhanas'}
							</div>
						</div>

						<div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
							<button
								onClick={() => onEdit(ann)}
								style={{
									padding: '4px 8px',
									background: '#f0f7f4',
									color: FLYER_HDR,
									border: '1px solid #c5ddd5',
									borderRadius: 4,
									cursor: 'pointer',
									fontSize: 11,
									fontWeight: 600,
								}}>
								Edit
							</button>
							<button
								onClick={() => onDelete(ann.id)}
								style={{
									padding: '4px 8px',
									background: '#fef2f2',
									color: '#c0392b',
									border: '1px solid #f5c6c6',
									borderRadius: 4,
									cursor: 'pointer',
									fontSize: 11,
									fontWeight: 600,
								}}>
								✕
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
