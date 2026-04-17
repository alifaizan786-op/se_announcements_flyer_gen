import * as LucideIcons from 'lucide-react';
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from 'react';

const GOTHAM =
	"'Gotham', 'Montserrat', 'Century Gothic', 'Gill Sans', sans-serif";

const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
	LucideIcons;

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

const COLOR_OPTIONS = [
	{ label: 'Evergreen', value: '#005D35' },
	{ label: 'Gold', value: '#B4995A' },
	{ label: 'Charcoal', value: '#404040' },
	{ label: 'Custom…', value: '__custom__' },
];

const PRESET_COLORS = COLOR_OPTIONS.filter((c) => c.value !== '__custom__');

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Auto-color cycle: Evergreen → Gold → Charcoal → … ─────────────────────────
const getNextIconBg = (count) =>
	PRESET_COLORS[count % PRESET_COLORS.length].value;

// Is the given hex value one of the presets?
const isPreset = (hex) => PRESET_COLORS.some((c) => c.value === hex);

// Validate / normalise a hex string — returns null if invalid
const normaliseHex = (raw) => {
	const s = raw.trim().replace(/^#+/, '');
	if (/^[0-9a-fA-F]{6}$/.test(s)) return `#${s.toUpperCase()}`;
	if (/^[0-9a-fA-F]{3}$/.test(s)) {
		const [a, b, c] = s;
		return `#${a}${a}${b}${b}${c}${c}`.toUpperCase();
	}
	return null;
};

const DEFAULT_FORM = {
	iconUrl: null,
	iconBg: PRESET_COLORS[0].value,
	title: '',
	description: '',
	date: '',
	time: '',
	timezone: 'EST',
	venue: '',
	jamatkhanas: [],
};

const blankForm = (announcementCount) => ({
	...DEFAULT_FORM,
	iconBg: getNextIconBg(announcementCount),
});

const SAMPLE = [
	{
		iconUrl: null,
		iconBg: '#005D35',
		title: 'Annual Jamati Programmatic Fund (AJPF)',
		description:
			'Tonight, we are launching the Annual Jamati Programmatic Fund (AJPF). Every contribution can make a huge difference, empowering every member of our Jamat. Please visit the desks in your local Jamatkhana to submit your contributions or give securely online via credit card or ACH at the.ismaili/JPF2026. ',
		date: '',
		time: '',
		timezone: 'EST',
		venue: '',
		jamatkhanas: [],
		id: 1776397407160,
	},
	{
		iconUrl: null,
		iconBg: '#B4995A',
		title: 'Southeast Spring Festival',
		description:
			'Join us for an exciting celebration of the spring season. Review the festival guide to make the most of your experience!',
		date: '2026-04-19',
		time: '12:30',
		timezone: 'EST',
		venue:
			'Stone Mountain Park, 1000 Robert E Lee Blvd, Stone Mountain, GA, 30083',
		jamatkhanas: [],
		id: 1776397442614,
	},
	{
		iconUrl: null,
		iconBg: '#16966C',
		title: 'AKHB | Heart Disease Awareness Session',
		description:
			'AKHB invites the Jamat to for a heart disease awareness. Take charge of your cardiovascular health with simple lifestyle changes!',
		date: '2026-04-24',
		time: '',
		timezone: 'EST',
		venue: 'Atlanta Headquarters Jamatkhana REC area',
		jamatkhanas: [],
		id: 1776397517970,
	},
	{
		iconUrl: null,
		iconBg: '#404040',
		title: 'Al-Ummah Alumni Community Service Opportunity',
		description:
			'Calling all Atlanta Al-Ummah Alumni! Join your fellow AU alums for a community service opportunity. Register now at http://tiny.cc/AUCivicReunion',
		date: '2026-04-25',
		time: '09:00',
		timezone: 'EST',
		venue:
			"Kate's Club, 1190 W Druid Hills Dr NE Suite T-80, Atlanta, GA, 30329",
		jamatkhanas: [],
		id: 1776397606405,
	},
	{
		iconUrl: null,
		iconBg: '#D2691E',
		title: 'AGI | Bollywood Movie Program',
		description:
			'A Bollywood movie program will be held for South Jamatkhana AGI Golden Club Members. For ticket details, please contact AGI volunteers. ',
		date: '2026-04-21',
		time: '13:00',
		timezone: 'EST',
		venue: 'AMC theater 24, 7065 Mount Zion Circle, Morrow, GA, 30260',
		jamatkhanas: [],
		id: 1776397698883,
	},
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtDate(d, t, tz) {
	if (!d && !t) return null;
	const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	const MONS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];
	const suf = (n) =>
		[, 'st', 'nd', 'rd'][
			((n % 100) - 10) * ((n % 100) - 11) * ((n % 100) - 12) !== 0 && n % 10 < 4
				? n % 10
				: 0
		] || 'th';
	if (d) {
		const [y, m, day] = d.split('-').map(Number);
		const dt = new Date(y, m - 1, day);
		let s = `${DAYS[dt.getDay()]}, ${MONS[dt.getMonth()]} ${day}${suf(day)}`;
		if (t) {
			const [h, mi] = t.split(':').map(Number);
			s += ` • ${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} ${tz}`;
		}
		return s;
	}
	const [h, mi] = t.split(':').map(Number);
	return `${h % 12 || 12}:${String(mi).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'} ${tz}`;
}

function IconBubble({ iconUrl, bgColor, size = 42 }) {
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

// ── Full-Width Card ────────────────────────────────────────────────────────────

function FullWidthCard({ ann }) {
	const ds = fmtDate(ann.date, ann.time, ann.timezone);
	console.log({ ds });
	return (
		<div
			style={{
				background: 'white',
				borderRadius: 5,
				padding: '11px 14px',
				display: 'flex',
				gap: 12,
				alignItems: 'flex-start',
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
							<span style={{ fontSize: 9.5, color: '#999', lineHeight: 1.4 }}>
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
					}}>
					{ann.description}
				</div>
				<div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
					{ds !== "" && (
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

// ── Flyer Preview ──────────────────────────────────────────────────────────────

const LETTER_W = 680;
const LETTER_H = 880;

function FlyerPreview({
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
			<div style={{ flexShrink: 0, padding: '5px 25px', fontSize: 20 }}>
				<span
					style={{ color: FLYER_GOLD, fontWeight: 700, fontFamily: GOTHAM }}>
					For More Information — Visit{' '}
				</span>
				<br />
				<span style={{ fontFamily: GOTHAM }}>
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

// ── Form Styles ────────────────────────────────────────────────────────────────

const LS = {
	display: 'block',
	fontSize: 10.5,
	fontWeight: 700,
	color: '#444',
	marginBottom: 4,
	letterSpacing: 0.8,
	textTransform: 'uppercase',
};
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

// ── Icon Bg Color Picker ───────────────────────────────────────────────────────
// Renders the preset dropdown + an inline hex input when "Custom…" is selected.

function IconBgPicker({ value, onChange }) {
	// Determine whether we're currently in custom mode
	const custom = !isPreset(value);

	// The raw text the user is typing in the hex field
	const [hexDraft, setHexDraft] = useState(custom ? value : '');

	// When the parent value changes externally (e.g. form reset), sync draft
	useEffect(() => {
		if (!isPreset(value)) setHexDraft(value);
	}, [value]);

	const handleSelectChange = (e) => {
		const v = e.target.value;
		if (v === '__custom__') {
			// Enter custom mode but keep whatever hex is in draft (or fall back to white)
			const fallback =
				hexDraft && normaliseHex(hexDraft) ? hexDraft : '#FFFFFF';
			const normed = normaliseHex(fallback) || '#FFFFFF';
			setHexDraft(normed);
			onChange(normed);
		} else {
			onChange(v);
		}
	};

	const handleHexChange = (e) => {
		const raw = e.target.value;
		setHexDraft(raw);
		const normed = normaliseHex(raw);
		if (normed) onChange(normed);
	};

	// Also allow native color picker to drive the hex field
	const handleColorPicker = (e) => {
		const hex = e.target.value.toUpperCase();
		setHexDraft(hex);
		onChange(hex);
	};

	// Which option is selected in the <select>?
	const selectValue = custom ? '__custom__' : value;
	const hexValid = !custom || !!normaliseHex(hexDraft);

	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
			<select value={selectValue} onChange={handleSelectChange} style={INP}>
				{COLOR_OPTIONS.map((c) => (
					<option key={c.value} value={c.value}>
						{c.label}
					</option>
				))}
			</select>

			{custom && (
				<div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
					{/* Native colour wheel */}
					<input
						type='color'
						value={normaliseHex(hexDraft) || '#FFFFFF'}
						onChange={handleColorPicker}
						title='Pick a colour'
						style={{
							width: 36,
							height: 34,
							padding: 2,
							border: '1px solid #d8d4cc',
							borderRadius: 6,
							cursor: 'pointer',
							background: 'white',
							flexShrink: 0,
						}}
					/>
					{/* Hex text field */}
					<div style={{ position: 'relative', flex: 1 }}>
						<span
							style={{
								position: 'absolute',
								left: 9,
								top: '50%',
								transform: 'translateY(-50%)',
								fontSize: 13,
								color: '#aaa',
								pointerEvents: 'none',
								userSelect: 'none',
							}}>
							#
						</span>
						<input
							value={hexDraft.replace(/^#/, '')}
							onChange={(e) =>
								handleHexChange({ target: { value: '#' + e.target.value } })
							}
							placeholder='005D35'
							maxLength={6}
							style={{
								...INP,
								paddingLeft: 22,
								borderColor: hexValid ? '#d8d4cc' : '#f5a6a6',
								fontFamily: 'monospace',
								letterSpacing: 1,
							}}
						/>
					</div>
					{/* Live swatch */}
					<div
						style={{
							width: 34,
							height: 34,
							borderRadius: 6,
							flexShrink: 0,
							background: normaliseHex(hexDraft) || '#eee',
							border: '1px solid #d8d4cc',
						}}
					/>
				</div>
			)}

			<div style={{ fontSize: 10.5, color: '#aaa' }}>
				{custom
					? 'Enter any 3- or 6-digit hex code, or use the colour picker.'
					: 'Auto-cycles Evergreen → Gold → Charcoal per new announcement.'}
			</div>
		</div>
	);
}

// ── Icon Upload ────────────────────────────────────────────────────────────────

function IconUpload({ iconUrl, bgColor, onChange }) {
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
						<div style={{ fontSize: 12, fontWeight: 600, color: FLYER_HDR }}>
							Icon uploaded
						</div>
					) : (
						<div style={{ fontSize: 12, fontWeight: 600, color: '#888' }}>
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

// ── JK Multi-Select ────────────────────────────────────────────────────────────

function JKMultiSelect({ value, onChange }) {
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
					<div style={{ display: 'flex', borderBottom: '1px solid #f0ede6' }}>
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

// ── Announcement Form ──────────────────────────────────────────────────────────

function AnnouncementForm({
	form,
	setForm,
	onSubmit,
	isEditing,
	onCancel,
	overflowError,
}) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
			{overflowError && (
				<div
					style={{
						display: 'flex',
						gap: 10,
						alignItems: 'flex-start',
						background: '#fef2f2',
						border: '1px solid #f5c6c6',
						borderRadius: 8,
						padding: '10px 12px',
					}}>
					<AlertTriangle
						size={16}
						color='#c0392b'
						style={{ flexShrink: 0, marginTop: 1 }}
					/>
					<div>
						<div
							style={{
								fontSize: 12,
								fontWeight: 700,
								color: '#c0392b',
								marginBottom: 3,
							}}>
							Announcement doesn't fit
						</div>
						<div style={{ fontSize: 11, color: '#888', lineHeight: 1.6 }}>
							The flyer is full. Try <strong>shortening the description</strong>
							, or go to the List tab and remove an item first.
						</div>
					</div>
				</div>
			)}

			<div>
				<label style={LS}>Icon</label>
				<IconUpload
					iconUrl={form.iconUrl}
					bgColor={form.iconBg}
					onChange={(iconUrl) => setForm((f) => ({ ...f, iconUrl }))}
				/>
			</div>

			<div>
				<label style={LS}>Icon Background Color</label>
				<IconBgPicker
					value={form.iconBg}
					onChange={(v) => setForm((f) => ({ ...f, iconBg: v }))}
				/>
			</div>

			<div>
				<label style={LS}>Title</label>
				<input
					value={form.title}
					onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
					placeholder='Announcement title'
					style={INP}
				/>
			</div>

			<div>
				<label style={LS}>Description</label>
				<textarea
					value={form.description}
					onChange={(e) =>
						setForm((f) => ({ ...f, description: e.target.value }))
					}
					placeholder='Brief description…'
					rows={3}
					style={{ ...INP, resize: 'vertical', lineHeight: 1.45 }}
				/>
			</div>

			<div
				style={{
					display: 'grid',
					gridTemplateColumns: '3fr 2fr 1fr',
					gap: 10,
				}}>
				<div>
					<label style={LS}>Date</label>
					<input
						type='date'
						value={form.date}
						onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
						style={INP}
					/>
				</div>
				<div>
					<label style={LS}>Time</label>
					<input
						type='time'
						value={form.time}
						onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
						style={INP}
					/>
				</div>
				<div>
					<label style={LS}>TZ</label>
					<select
						value={form.timezone}
						onChange={(e) =>
							setForm((f) => ({ ...f, timezone: e.target.value }))
						}
						style={INP}>
						{['EST', 'CST', 'MST', 'PST'].map((tz) => (
							<option key={tz} value={tz}>
								{tz}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label style={LS}>Venue</label>
				<input
					value={form.venue}
					onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
					placeholder='Location or address'
					style={INP}
				/>
			</div>

			<div>
				<label style={LS}>Jamatkhanas</label>
				<JKMultiSelect
					value={form.jamatkhanas}
					onChange={(jks) => setForm((f) => ({ ...f, jamatkhanas: jks }))}
				/>
				{form.jamatkhanas.length > 0 && (
					<div
						style={{
							marginTop: 5,
							fontSize: 11,
							background: '#e6f2ec',
							color: FLYER_HDR,
							padding: '4px 10px',
							borderRadius: 4,
							fontWeight: 600,
						}}>
						{form.jamatkhanas.join(' • ')}
					</div>
				)}
			</div>

			<div style={{ display: 'flex', gap: 8, paddingTop: 2 }}>
				{isEditing && (
					<button
						onClick={onCancel}
						style={{
							flex: 1,
							padding: '9px 0',
							background: 'white',
							color: '#666',
							border: '1px solid #ddd',
							borderRadius: 6,
							cursor: 'pointer',
							fontWeight: 500,
							fontSize: 13,
						}}>
						Cancel
					</button>
				)}
				<button
					onClick={onSubmit}
					disabled={!form.title.trim()}
					style={{
						flex: 2,
						padding: '9px 0',
						background: form.title.trim() ? FLYER_HDR : '#c5c5c0',
						color: 'white',
						border: 'none',
						borderRadius: 6,
						cursor: form.title.trim() ? 'pointer' : 'default',
						fontWeight: 700,
						fontSize: 13,
						letterSpacing: 0.3,
					}}>
					{isEditing ? 'Update Announcement' : '+ Add Announcement'}
				</button>
			</div>
		</div>
	);
}

// ── Announcement List ──────────────────────────────────────────────────────────

function AnnouncementList({
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
								<div style={{ fontSize: 10.5, color: FLYER_HDR, marginTop: 2 }}>
									{ds} {ann.timezone}
								</div>
							)}
							{ann.venue && (
								<div style={{ fontSize: 10.5, color: '#888', marginTop: 1 }}>
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

// ── Settings Panel ─────────────────────────────────────────────────────────────

function SettingsPanel({
	headerTitle,
	setHeaderTitle,
	headerSubtitle,
	setHeaderSubtitle,
	footerUrl,
	setFooterUrl,
}) {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
			<div
				style={{
					padding: '10px 12px',
					background: '#f0f7f4',
					borderRadius: 7,
					border: '1px solid #c5ddd5',
				}}>
				<div
					style={{
						fontSize: 11,
						fontWeight: 700,
						color: FLYER_HDR,
						marginBottom: 2,
					}}>
					Flyer Header
				</div>
				<div style={{ fontSize: 11, color: '#666' }}>
					Customize the top section of your flyer
				</div>
			</div>
			<div>
				<label style={LS}>Header Title</label>
				<input
					value={headerTitle}
					onChange={(e) => setHeaderTitle(e.target.value)}
					style={INP}
					placeholder='LOCAL ANNOUNCEMENTS'
				/>
			</div>
			<div>
				<label style={LS}>Date Range / Subtitle</label>
				<input
					value={headerSubtitle}
					onChange={(e) => setHeaderSubtitle(e.target.value)}
					style={INP}
					placeholder='MARCH – APRIL 2026'
				/>
			</div>
			<div>
				<label style={LS}>Footer URL / Text</label>
				<textarea
					value={footerUrl}
					onChange={(e) => setFooterUrl(e.target.value)}
					rows={2}
					style={{ ...INP, resize: 'vertical' }}
					placeholder='https://prime.southeastcouncil.com/news-feed-southeast'
				/>
			</div>
		</div>
	);
}

// ── Main App ───────────────────────────────────────────────────────────────────

export default function FlyerApp() {
	const [announcements, setAnnouncements] = useState(SAMPLE);
	const [form, setForm] = useState(() => blankForm(SAMPLE.length));
	const [editingId, setEditingId] = useState(null);
	const [activeTab, setActiveTab] = useState('add');
	const [headerTitle, setHeaderTitle] = useState('LOCAL ANNOUNCEMENTS');
	const [headerSubtitle, setHeaderSubtitle] = useState('Friday, April 3, 2026');
	const [footerUrl, setFooterUrl] = useState('https://tinyurl.com/SEWeekly');
	const [exporting, setExporting] = useState(null);
	const [overflowError, setOverflowError] = useState(false);
	const [pendingId, setPendingId] = useState(null);
	const [pendingForm, setPendingForm] = useState(null);

	console.log(announcements);

	const previewRef = useRef(null);
	const bodyRef = useRef(null);

	// ── Overflow check ─────────────────────────────────────────────────────────
	useLayoutEffect(() => {
		if (pendingId === null || !bodyRef.current) return;
		const el = bodyRef.current;
		if (el.scrollHeight > el.clientHeight) {
			setAnnouncements((prev) => prev.filter((a) => a.id !== pendingId));
			if (pendingForm) setForm(pendingForm);
			setOverflowError(true);
			setActiveTab('add');
		} else {
			setOverflowError(false);
			setForm(blankForm(announcements.length));
			setActiveTab('list');
		}
		setPendingId(null);
		setPendingForm(null);
	}, [pendingId, announcements]);

	useEffect(() => {
		if (overflowError && bodyRef.current) {
			const el = bodyRef.current;
			if (el.scrollHeight <= el.clientHeight) setOverflowError(false);
		}
	}, [announcements, overflowError]);

	useEffect(() => {
		const load = (src, cb) => {
			if (document.querySelector(`script[src="${src}"]`)) {
				cb && cb();
				return;
			}
			const s = document.createElement('script');
			s.src = src;
			s.onload = cb;
			document.head.appendChild(s);
		};
		load(
			'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js',
			() =>
				load(
					'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
				),
		);
	}, []);

	// ── Handlers ───────────────────────────────────────────────────────────────

	const handleSubmit = useCallback(() => {
		if (!form.title.trim()) return;
		if (editingId !== null) {
			setAnnouncements((prev) =>
				prev.map((a) => (a.id === editingId ? { ...form, id: editingId } : a)),
			);
			setEditingId(null);
			setForm(blankForm(announcements.length));
			setActiveTab('list');
		} else {
			const newId = Date.now();
			setPendingForm({ ...form });
			setAnnouncements((prev) => [...prev, { ...form, id: newId }]);
			setPendingId(newId);
		}
	}, [form, editingId, announcements.length]);

	const handleEdit = useCallback((ann) => {
		setForm({ ...DEFAULT_FORM, ...ann });
		setEditingId(ann.id);
		setActiveTab('add');
	}, []);

	const handleDelete = useCallback(
		(id) => {
			setAnnouncements((prev) => prev.filter((a) => a.id !== id));
			if (editingId === id) {
				setEditingId(null);
				setForm(blankForm(announcements.length - 1));
			}
		},
		[editingId, announcements.length],
	);

	const handleCancel = useCallback(() => {
		setEditingId(null);
		setForm(blankForm(announcements.length));
		setOverflowError(false);
	}, [announcements.length]);

	const handleClearAll = useCallback(() => {
		setAnnouncements([]);
		setEditingId(null);
		setOverflowError(false);
		setForm(blankForm(0));
	}, []);

	const handleMoveUp = useCallback((idx) => {
		if (idx === 0) return;
		setAnnouncements((prev) => {
			const next = [...prev];
			[next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
			return next;
		});
	}, []);

	const handleMoveDown = useCallback((idx) => {
		setAnnouncements((prev) => {
			if (idx >= prev.length - 1) return prev;
			const next = [...prev];
			[next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
			return next;
		});
	}, []);

	const handleExport = async (fmt) => {
		if (!window.html2canvas || !previewRef.current) {
			alert(
				'Export libraries still loading. Please wait a moment and try again.',
			);
			return;
		}
		setExporting(fmt);
		try {
			const canvas = await window.html2canvas(previewRef.current, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: FLYER_BG,
				logging: false,
			});
			if (fmt === 'pdf') {
				const { jsPDF } = window.jspdf;
				const w = canvas.width / 2,
					h = canvas.height / 2;
				const pdf = new jsPDF({
					orientation: w > h ? 'landscape' : 'portrait',
					unit: 'px',
					format: [w, h],
				});
				pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, w, h);
				pdf.save('announcement-flyer.pdf');
			} else {
				const a = document.createElement('a');
				a.download = `announcement-flyer.${fmt}`;
				a.href = canvas.toDataURL(`image/${fmt}`, 0.95);
				a.click();
			}
		} catch (e) {
			alert('Export failed: ' + e.message);
		}
		setExporting(null);
	};

	const TABS = [
		{
			id: 'add',
			label:
				overflowError && !editingId ? '⚠ Add' : editingId ? '✏ Edit' : '+ Add',
		},
		{ id: 'list', label: `≡ List (${announcements.length})` },
		{ id: 'settings', label: '⚙ Settings' },
	];

	return (
		<div
			style={{
				display: 'flex',
				height: '100vh',
				background: '#1a1a1a',
				fontFamily: GOTHAM,
				overflow: 'hidden',
			}}>
			{/* ── Left Panel ── */}
			<div
				style={{
					width: 360,
					background: '#faf9f5',
					display: 'flex',
					flexDirection: 'column',
					boxShadow: '2px 0 12px rgba(0,0,0,0.2)',
					zIndex: 10,
					flexShrink: 0,
				}}>
				<div style={{ background: FLYER_HDR, padding: '14px 16px 12px' }}>
					<div
						style={{
							color: 'white',
							fontWeight: 800,
							fontSize: 15,
							letterSpacing: 0.5,
						}}>
						Flyer Builder
					</div>
					<div
						style={{
							color: 'rgba(255,255,255,0.55)',
							fontSize: 10.5,
							marginTop: 2,
							letterSpacing: 1.5,
							textTransform: 'uppercase',
						}}>
						Ismaili Council — Southeast USA
					</div>
				</div>

				{/* Tabs */}
				<div
					style={{
						display: 'flex',
						background: 'white',
						borderBottom: '1px solid #e5e2d8',
					}}>
					{TABS.map((tab) => {
						const isError = tab.id === 'add' && overflowError && !editingId;
						return (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								style={{
									flex: 1,
									padding: '9px 0',
									border: 'none',
									cursor: 'pointer',
									background:
										activeTab === tab.id
											? isError
												? '#fef2f2'
												: '#f0f7f4'
											: 'white',
									color: isError
										? '#c0392b'
										: activeTab === tab.id
											? FLYER_HDR
											: '#777',
									fontWeight: activeTab === tab.id ? 700 : 400,
									fontSize: 11.5,
									borderBottom:
										activeTab === tab.id
											? `2px solid ${isError ? '#c0392b' : FLYER_HDR}`
											: '2px solid transparent',
								}}>
								{tab.label}
							</button>
						);
					})}
				</div>

				<div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
					{activeTab === 'add' && (
						<AnnouncementForm
							form={form}
							setForm={setForm}
							onSubmit={handleSubmit}
							isEditing={editingId !== null}
							onCancel={handleCancel}
							overflowError={overflowError && !editingId}
						/>
					)}
					{activeTab === 'list' && (
						<AnnouncementList
							announcements={announcements}
							onEdit={handleEdit}
							onDelete={handleDelete}
							onMoveUp={handleMoveUp}
							onMoveDown={handleMoveDown}
							onClearAll={handleClearAll}
						/>
					)}
					{activeTab === 'settings' && (
						<SettingsPanel
							headerTitle={headerTitle}
							setHeaderTitle={setHeaderTitle}
							headerSubtitle={headerSubtitle}
							setHeaderSubtitle={setHeaderSubtitle}
							footerUrl={footerUrl}
							setFooterUrl={setFooterUrl}
						/>
					)}
				</div>

				{/* Export Row */}
				<div
					style={{
						padding: '12px 14px',
						borderTop: '1px solid #e5e2d8',
						background: 'white',
					}}>
					<div
						style={{
							fontSize: 10,
							color: '#aaa',
							marginBottom: 7,
							letterSpacing: 1,
							textTransform: 'uppercase',
							fontWeight: 600,
						}}>
						Export Flyer
					</div>
					<div style={{ display: 'flex', gap: 7 }}>
						{['PNG', 'JPEG', 'PDF'].map((fmt) => (
							<button
								key={fmt}
								onClick={() => handleExport(fmt.toLowerCase())}
								disabled={!!exporting}
								style={{
									flex: 1,
									padding: '9px 0',
									border: 'none',
									borderRadius: 6,
									cursor: exporting ? 'default' : 'pointer',
									background:
										exporting === fmt.toLowerCase() ? '#7aab95' : FLYER_HDR,
									color: 'white',
									fontWeight: 700,
									fontSize: 12,
									letterSpacing: 0.5,
									transition: 'background 0.2s',
								}}>
								{exporting === fmt.toLowerCase() ? '…' : `↓ ${fmt}`}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* ── Right Panel (Preview) ── */}
			<div
				style={{
					flex: 1,
					overflowY: 'auto',
					padding: '32px 40px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
				<div
					style={{
						marginBottom: 12,
						color: 'rgba(255,255,255,0.4)',
						fontSize: 10,
						letterSpacing: 2,
						textTransform: 'uppercase',
					}}>
					Live Preview — US Letter (8.5" × 11")
				</div>
				<div
					ref={previewRef}
					style={{
						boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
						borderRadius: 2,
						flexShrink: 0,
					}}>
					<FlyerPreview
						announcements={announcements}
						headerTitle={headerTitle}
						headerSubtitle={headerSubtitle}
						footerUrl={footerUrl}
						bodyRef={bodyRef}
					/>
				</div>
				<div style={{ height: 40 }} />
			</div>
		</div>
	);
}
