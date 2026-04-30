import * as LucideIcons from 'lucide-react';
import IconBgPicker from './IconBgPicker';
import IconUpload from './IconUpload';
import JKMultiSelect from './JkMultiSelect';

const { ChevronDown, Check, Upload, X, ChevronUp, AlertTriangle, Trash2 } =
	LucideIcons;

    

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

const FLYER_HDR = '#005D35';
const FLYER_GOLD = '#B4995A';
const FLYER_BG = '#F5F4EE';

// ── Announcement Form ──────────────────────────────────────────────────────────
export default function AnnouncementForm({
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
						<div
							style={{
								fontSize: 11,
								color: '#888',
								lineHeight: 1.6,
							}}>
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
