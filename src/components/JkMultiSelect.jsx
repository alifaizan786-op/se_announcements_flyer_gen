import * as LucideIcons from 'lucide-react';

import {
	useEffect,
	useRef,
	useState
} from 'react';

const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
	LucideIcons;

	const INP = {
	width: '100%',
	padding: '7px 10px',
	border: '1px solid #d8d4cc',
	borderRadius: 6,
	fontSize: 13,
	boxSizing: 'border-box',
	fontFamily: 'system-ui, sans-serif',
	color: '#222',
	outline: 'none',
	background: 'white',
};

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

const JK_OPTIONS = [
	'All Southeast Jamatkhanas',
	'All Metro Atlanta Jamatkhanas',
	'Atlanta Headquarters',
	'Atlanta Northeast',
	'Atlanta Northwest',
	'Atlanta South',
	'Duluth',
	'Birmingham',
	'Chattanooga',
	'Knoxville',
	'Memphis',
	'Nashville',
	'Spartanburg',
	'Raleigh (G)',
	'Charleston (G)',
	'Kentucky (G)',
];


// ── JK Multi-Select ────────────────────────────────────────────────────────────
export default function JKMultiSelect({ value, onChange }) {
	const [open, setOpen] = useState(false);
	const ref = useRef(null);

	useEffect(() => {
		const h = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setOpen(false);
		};
		document.addEventListener('mousedown', h);
		return () => document.removeEventListener('mousedown', h);
	}, []);

	const toggle = (jk) =>
		onChange(
			value.includes(jk) ? value.filter((j) => j !== jk) : [...value, jk],
		);

	return (
		<div ref={ref} style={{ position: 'relative' }}>
			<button
				onClick={() => setOpen((o) => !o)}
				style={{
					...INP,
					display: 'flex',
					alignItems: 'center',
					cursor: 'pointer',
					border: '1px solid #d8d4cc',
					padding: '7px 10px',
					gap: 6,
				}}>
				<span
					style={{
						flex: 1,
						textAlign: 'left',
						fontSize: 12,
						color: value.length ? '#222' : '#aaa',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}>
					{value.length === 0
						? 'Select Jamatkhanas…'
						: value.length <= 2
							? value.join(', ')
							: `${value[0]}, +${value.length - 1} more`}
				</span>
				{value.length > 0 && (
					<span
						style={{
							background: FLYER_HDR,
							color: 'white',
							borderRadius: 10,
							fontSize: 10,
							fontWeight: 700,
							padding: '1px 7px',
							flexShrink: 0,
						}}>
						{value.length}
					</span>
				)}
				<ChevronDown size={13} color='#888' />
			</button>
			{open && (
				<div
					style={{
						position: 'absolute',
						top: 'calc(100% + 4px)',
						left: 0,
						right: 0,
						zIndex: 200,
						background: 'white',
						border: '1px solid #d8d4cc',
						borderRadius: 8,
						boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
						overflow: 'hidden',
					}}>
					<div
						style={{
							display: 'flex',
							borderBottom: '1px solid #f0ede6',
						}}>
						{['All', 'Clear'].map((lbl, i) => (
							<button
								key={lbl}
								onClick={() => onChange(i === 0 ? [...JK_OPTIONS] : [])}
								style={{
									flex: 1,
									padding: '7px 0',
									border: 'none',
									background: '#fafaf7',
									fontSize: 11,
									color: i === 0 ? FLYER_HDR : '#888',
									cursor: 'pointer',
									fontWeight: 600,
								}}>
								{lbl}
							</button>
						))}
					</div>
					<div style={{ maxHeight: 230, overflowY: 'auto' }}>
						{JK_OPTIONS.map((jk) => {
							const on = value.includes(jk);
							return (
								<div
									key={jk}
									onClick={() => toggle(jk)}
									style={{
										display: 'flex',
										alignItems: 'center',
										gap: 9,
										padding: '8px 12px',
										cursor: 'pointer',
										fontSize: 12.5,
										background: on ? '#eef5f1' : 'white',
										borderBottom: '1px solid #f7f6f0',
									}}>
									<div
										style={{
											width: 15,
											height: 15,
											borderRadius: 3,
											flexShrink: 0,
											border: `1.5px solid ${on ? FLYER_HDR : '#ccc'}`,
											background: on ? FLYER_HDR : 'white',
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'center',
										}}>
										{on && <Check size={9} color='white' strokeWidth={3} />}
									</div>
									{jk}
								</div>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
}