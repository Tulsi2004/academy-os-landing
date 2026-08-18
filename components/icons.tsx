import type { SVGProps } from "react";

function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    />
  );
}

export function EnquiriesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </Icon>
  );
}

export function StudentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.1 2.7 2 6 2s6-.9 6-2v-5" />
    </Icon>
  );
}

export function FeesAttendanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17" />
      <path d="M8 3v3M16 3v3" />
      <path d="m8.5 14 2 2 4-4" />
    </Icon>
  );
}

export function DashboardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="8" height="8" rx="1.5" />
      <rect x="13" y="3" width="8" height="5" rx="1.5" />
      <rect x="13" y="10" width="8" height="11" rx="1.5" />
      <rect x="3" y="13" width="8" height="8" rx="1.5" />
    </Icon>
  );
}

export function ParentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="9" cy="7" r="3.25" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <circle cx="17.5" cy="8" r="2.5" />
      <path d="M21.5 20c0-2.9-1.9-5.3-4.5-6.1" />
    </Icon>
  );
}

export function CoursesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v16H5.5A1.5 1.5 0 0 0 4 20.5v-16Z" />
      <path d="M4 17.5A1.5 1.5 0 0 1 5.5 16H19" />
    </Icon>
  );
}

export function BatchesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
      <path d="m3 12 9 4.5 9-4.5" />
      <path d="m3 16.5 9 4.5 9-4.5" />
    </Icon>
  );
}

export function TeachersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      <path d="m9.5 12.5 2 2 3.5-4" />
    </Icon>
  );
}

export function AttendanceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17" />
      <path d="M8 3v3M16 3v3" />
      <path d="m8.5 14 2 2 4-4" />
    </Icon>
  );
}

export function FeesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="6" width="19" height="13" rx="2" />
      <path d="M2.5 10.5h19" />
      <path d="M6 15h4" />
    </Icon>
  );
}

export function EventsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2" />
      <path d="M3.5 9h17" />
      <path d="M8 3v3M16 3v3" />
      <circle cx="15.5" cy="15" r="2.5" />
      <path d="M15.5 14v1l.75.5" />
    </Icon>
  );
}

export function ExamsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8 3.5h8a1.5 1.5 0 0 1 1.5 1.5v15l-5.5-3-5.5 3v-15A1.5 1.5 0 0 1 8 3.5Z" />
      <path d="M9 8h6M9 11.5h6" />
    </Icon>
  );
}

export function DocumentsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v5h5" />
      <path d="M8.5 13h7M8.5 16.5h7" />
    </Icon>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path className="clock-hand-hour" d="M12 12 12 8" />
      <path className="clock-hand-minute" d="M12 12 15.2 13.6" />
    </Icon>
  );
}

export function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M5.5 16V11a6.5 6.5 0 0 1 13 0v5l1.6 2.5H3.9L5.5 16Z" />
      <path d="M9.75 20a2.25 2.25 0 0 0 4.5 0" />
    </Icon>
  );
}

export function TeamIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <circle cx="8.5" cy="8" r="3.25" />
      <circle cx="16" cy="9.5" r="2.5" />
      <path d="M2.5 20c0-3.6 2.7-6.5 6-6.5s6 2.9 6 6.5" />
      <path d="M14.5 14.2c2.6.4 4.5 2.7 4.5 5.8" />
    </Icon>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5Z" />
      <path d="m9 12 2 2 4-4.5" />
    </Icon>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m4 12.5 5 5 11-11" />
    </Icon>
  );
}

export function ChevronIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m6 9 6 6 6-6" />
    </Icon>
  );
}

export function LinkedInGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7.5 10.5v6M7.5 7.75v.01" />
      <path d="M11.5 16.5v-3.75a2.25 2.25 0 0 1 4.5 0V16.5" />
      <path d="M11.5 16.5v-6" />
    </Icon>
  );
}

export function InstagramGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.75" />
      <path d="M16.7 7.3v.01" />
    </Icon>
  );
}

export function WhatsAppGlyph(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M4 20l1.2-3.9A7.75 7.75 0 1 1 8.6 19L4 20Z" />
      <path d="M8.7 9.3c.15-.5.5-.5.85-.5.3 0 .45.1.55.35.15.35.5 1.2.55 1.3.05.1.08.25 0 .4-.1.2-.15.3-.3.45-.15.15-.3.35-.15.6.35.65.85 1.2 1.45 1.6.6.4.85.35 1.05.15.2-.2.35-.4.5-.55.15-.15.3-.15.5-.05.2.1 1.25.6 1.45.7.2.1.35.15.4.25.05.1.05.55-.15 1.05-.2.5-1.15.95-1.6.98-.4.03-.75.15-2.55-.6-1.8-.75-2.9-2.55-3-2.7-.1-.15-.75-1-.75-1.9 0-.9.45-1.35.6-1.55Z" />
    </Icon>
  );
}
