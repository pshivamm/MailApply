import { type SVGAttributes, forwardRef } from 'react'

type IconProps = SVGAttributes<SVGSVGElement> & { size?: number }

function createIcon(paths: string | string[], viewBox = '0 0 24 24') {
  return forwardRef<SVGSVGElement, IconProps>(({ size = 24, className, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      {(Array.isArray(paths) ? paths : [paths]).map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  ))
}

function createFilledIcon(paths: string, viewBox = '0 0 24 24') {
  return forwardRef<SVGSVGElement, IconProps>(({ size = 24, className, ...props }, ref) => (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="currentColor"
      stroke="none"
      className={className}
      {...props}
    >
      <path d={paths} />
    </svg>
  ))
}

export const LayoutDashboard = createIcon([
  'M9 3H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z',
  'M19 3h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z',
  'M9 13H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z',
  'M19 13h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2Z',
])

export const FileText = createIcon([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z',
  'M14 2v6h6',
  'M16 13H8',
  'M16 17H8',
  'M10 9H8',
])

export const SendHorizontal = createIcon([
  'M3 12h18',
  'M14 5l7 7-7 7',
])

export const Briefcase = createIcon([
  'M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  'M4 7h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z',
  'M12 12v3',
  'M8 7v-2',
  'M16 7v-2',
])

export const BarChart3 = createIcon([
  'M4 6v13a1 1 0 0 0 1 1h15',
  'M8 16V9',
  'M12 16V6',
  'M16 16v-4',
])

export const UserCircle = createIcon([
  'M18 20a6 6 0 0 0-12 0',
  'M12 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
])

export const Settings = createIcon([
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
  'M18.73 5.27l-1.5-1.5-2.5.87-.87-2.5-1.5-1.5-1.5 1.5-.87 2.5-2.5.87-1.5 1.5 1.5 1.5 2.5.87.87 2.5 1.5 1.5 1.5-1.5.87-2.5 2.5-.87 1.5-1.5Z',
])

export const LogOut = createIcon([
  'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4',
  'M16 17l5-5-5-5',
  'M21 12H9',
])

export const Search = createIcon([
  'M17 17l4 4',
  'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z',
])

export const Bell = createIcon([
  'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9',
  'M13.73 21a2 2 0 0 1-3.46 0',
])

export const PanelLeft = createIcon([
  'M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z',
  'M9 3v18',
])

export const Sun = createIcon([
  'M12 1v2',
  'M12 21v2',
  'M4.22 4.22l1.42 1.42',
  'M18.36 18.36l1.42 1.42',
  'M1 12h2',
  'M21 12h2',
  'M4.22 19.78l1.42-1.42',
  'M18.36 5.64l1.42-1.42',
  'M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14Z',
])

export const Moon = createIcon([
  'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z',
])

export const ChevronRight = createIcon([
  'M9 18l6-6-6-6',
])

export const ChevronLeft = createIcon([
  'M15 18l-6-6 6-6',
])

export const ChevronDown = createIcon([
  'M6 9l6 6 6-6',
])

export const ChevronUp = createIcon([
  'M18 15l-6-6-6 6',
])

export const ChevronsUpDown = createIcon([
  'M7 15l5 5 5-5',
  'M7 9l5-5 5 5',
])

export const MoreHorizontal = createIcon([
  'M12 12h.01',
  'M5 12h.01',
  'M19 12h.01',
])

export const X = createIcon([
  'M18 6L6 18',
  'M6 6l12 12',
])

export const Check = createIcon([
  'M5 12l5 5L20 7',
])

export const Mail = createIcon([
  'M22 5l-10 7L2 5',
  'M2 5v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5',
])

export const Eye = createIcon([
  'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z',
  'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
])

export const EyeOff = createIcon([
  'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94',
  'M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19',
  'M14.12 14.12a3 3 0 1 1-4.24-4.24',
  'M1 1l22 22',
])

export const Loader2 = createIcon([
  'M12 2v4',
  'M12 18v4',
  'M4.93 4.93l2.83 2.83',
  'M16.24 16.24l2.83 2.83',
  'M2 12h4',
  'M18 12h4',
  'M4.93 19.07l2.83-2.83',
  'M16.24 7.76l2.83-2.83',
])

export const Trash2 = createIcon([
  'M3 6h18',
  'M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2',
  'M19 6v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
  'M10 11v6',
  'M14 11v6',
])

export const Plus = createIcon([
  'M12 5v14',
  'M5 12h14',
])

export const Pencil = createIcon([
  'M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z',
])

export const Copy = createIcon([
  'M8 4V2h10v2',
  'M14 14v4',
  'M6 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
  'M10 14h4',
  'M10 18h4',
])

export const Download = createIcon([
  'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4',
  'M12 3v12',
  'M7 10l5 5 5-5',
])

export const Send = createIcon([
  'M22 2L11 13',
  'M22 2l-7 20-4-9-9-4 20-7Z',
])

export const FileSpreadsheet = createIcon([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z',
  'M14 2v6h6',
  'M8 13h8',
  'M8 17h8',
  'M8 21h8',
])

export const FilterX = createIcon([
  'M3 4h18l-8 9.46V19l-4-2v-3.54L3 4Z',
  'M17 17l4 4',
  'M21 17l-4 4',
])

export const Percent = createIcon([
  'M19 5L5 19',
  'M7 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
  'M17 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z',
])

export const Camera = createIcon([
  'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11Z',
  'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
])

export const Save = createIcon([
  'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z',
  'M17 21v-7H7v7',
  'M7 3v4h8',
])

export const Key = createIcon([
  'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.78 7.78 5.5 5.5 0 0 1 7.78-7.78Zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
])

export const AlertTriangle = createIcon([
  'M12 9v4',
  'M12 17h.01',
  'M10.29 3.86l-8.1 14c-.6 1.04.15 2.14 1.21 2.14h17.2c1.06 0 1.81-1.1 1.21-2.14l-8.1-14c-.6-1.04-2.14-1.04-2.74 0Z',
])

export const RefreshCw = createIcon([
  'M21 12a9 9 0 0 0-9-9 9.87 9.87 0 0 0-6 2',
  'M3 12a9 9 0 0 0 9 9 9.87 9.87 0 0 0 6-2',
  'M9 3L3 7l4-4',
  'M15 21l6-4-4 4',
])

export const Inbox = createIcon([
  'M22 12h-5l-2 3H9l-2-3H2',
  'M2 12v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5',
  'M12 2v8',
  'M9 7l3-3 3 3',
])

export const ArrowLeft = createIcon([
  'M19 12H5',
  'M12 19l-7-7 7-7',
])

export const ArrowRight = createIcon([
  'M5 12h14',
  'M12 5l7 7-7 7',
])

export const ArrowUp = createIcon([
  'M12 19V5',
  'M5 12l7-7 7 7',
])

export const ArrowDown = createIcon([
  'M12 5v14',
  'M19 12l-7 7-7-7',
])

export const Building2 = createIcon([
  'M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18',
  'M3 22h18',
  'M9 7h2',
  'M9 11h2',
  'M13 7h2',
  'M13 11h2',
  'M9 15h2',
  'M13 15h2',
])

export const MapPin = createIcon([
  'M12 22s-8-6-8-12a8 8 0 0 1 16 0c0 6-8 12-8 12Z',
  'M12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
])

export const Globe = createIcon([
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
  'M2 12h20',
  'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z',
])

export const Menu = createIcon([
  'M3 6h18',
  'M3 12h18',
  'M3 18h18',
])

export const Award = createIcon([
  'M12 15l-3 3-2-2 5-5 5 5-2 2-3-3Z',
  'M12 2l3.09 3.09L18 4l.91 2.91L22 8l-2.09 2.91L21 14l-3 .09L15 17l-3-3-3 3-3-2.91L3 14l1.09-3.09L2 8l3.09-.09L6 4l2.91.91L12 2Z',
])

export const Clock = createIcon([
  'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z',
  'M12 6v6l4 2',
])

export const TrendingUp = createIcon([
  'M23 6l-9.5 9.5-5-5L1 18',
  'M17 6h6v6',
])

export const UserCheck = createIcon([
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'M17 13l3 3 4-4',
])

export const Activity = createIcon([
  'M22 12h-4l-3 9L9 3l-3 9H2',
])

export const MessageCircle = createIcon([
  'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z',
])

export const Monitor = createFilledIcon(
  'M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6.5l-.5 2H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-2l-.5-2H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z'
)

export const Palette = createIcon([
  'M12 2a10 10 0 0 0 0 20 2 2 0 0 0 2-2v-.5a1.5 1.5 0 0 1 3 0 2 2 0 0 0 2 2A10 10 0 0 0 12 2Z',
  'M7 10h.01',
  'M10 7h.01',
  'M14 7h.01',
  'M17 10h.01',
])

export const Shield = createIcon([
  'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
])

export const Grid3X3 = createIcon([
  'M3 3h7v7H3Z',
  'M14 3h7v7h-7Z',
  'M3 14h7v7H3Z',
  'M14 14h7v7h-7Z',
])

export const List = createIcon([
  'M3 6h18',
  'M3 12h18',
  'M3 18h18',
])

export const ToggleLeft = createIcon([
  'M8 12h.01',
  'M2 12a6 6 0 0 1 6-6h8a6 6 0 0 1 0 12H8a6 6 0 0 1-6-6Z',
])

export const ToggleRight = createIcon([
  'M16 12h.01',
  'M2 12a6 6 0 0 1 6-6h8a6 6 0 0 1 0 12H8a6 6 0 0 1-6-6Z',
])

export const Zap = createIcon([
  'M13 2L3 14h9l-1 8 10-12h-9l1-8Z',
])

export const MailCheck = createIcon([
  'M22 5l-10 7L2 5',
  'M2 5v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5',
  'M15 12l2 2 4-4',
])

export const Smartphone = createIcon([
  'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z',
  'M12 18h.01',
])

export const UserPlus = createIcon([
  'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2',
  'M8 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'M18 8v6',
  'M21 11h-6',
])

export const Quote = createIcon([
  'M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1Z',
  'M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1Z',
])

export const Play = createIcon([
  'M6 3l15 9-15 9V3Z',
])

export const AtSign = createIcon([
  'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
  'M16 8v5a3 3 0 1 0 6 0v-1a10 10 0 1 0-3.92 7.94',
])

export const PieChart = createIcon([
  'M21.21 15.89A10 10 0 1 1 8 2.83',
  'M22 12A10 10 0 0 0 12 2v10h10Z',
])

export const FileTextSimple = createIcon([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z',
  'M14 2v6h6',
])

export const Circle = createIcon([
  'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0-20 0',
])

export const Filter = createIcon([
  'M3 4h18l-8 9.46V19l-4-2v-3.54L3 4Z',
])

export const CheckCheck = createIcon([
  'M18 6L7 17l-5-5',
  'M22 10l-7.5 7.5L13 16',
])

export const FileDown = createIcon([
  'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z',
  'M14 2v6h6',
  'M12 18v-6',
  'M9 15l3 3 3-3',
])
