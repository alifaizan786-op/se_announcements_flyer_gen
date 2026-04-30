import { useEffect, useState } from 'react';

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
const COLOR_OPTIONS = [
	{ label: 'Evergreen', value: '#005D35' },
	{ label: 'Gold', value: '#B4995A' },
	{ label: 'Charcoal', value: '#404040' },
	{ label: 'Custom…', value: '__custom__' },
];

const PRESET_COLORS = COLOR_OPTIONS.filter((c) => c.value !== '__custom__');

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

export default function IconBgPicker({ value, onChange }) {
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
								handleHexChange({
									target: { value: '#' + e.target.value },
								})
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
