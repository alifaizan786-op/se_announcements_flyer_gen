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

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Settings Panel ─────────────────────────────────────────────────────────────
export default function SettingsPanel({
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
