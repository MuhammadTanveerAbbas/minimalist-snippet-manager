import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Snippet Manager - Developer Code Library'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a0a',
          fontFamily: '"Geist Mono", "JetBrains Mono", monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.03) 0%, transparent 60%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            marginBottom: '12px',
          }}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 32 32"
            fill="none"
            style={{ opacity: 0.9 }}
          >
            <rect width="32" height="32" rx="8" fill="#0f0f0f" />
            <circle cx="7.5" cy="8" r="1.8" fill="white" opacity="0.35" />
            <path
              d="M8 16.5L12 19.5L8 22.5"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity="0.9"
            />
            <rect x="15" y="17" width="9" height="2.5" rx="1" fill="white" opacity="0.8" />
            <rect x="15" y="21.5" width="5.5" height="2" rx="1" fill="white" opacity="0.25" />
          </svg>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span
              style={{
                fontSize: '64px',
                fontWeight: 700,
                color: 'white',
                letterSpacing: '-1px',
                lineHeight: 1.1,
              }}
            >
              Snippet Manager
            </span>
            <span
              style={{
                fontSize: '24px',
                color: '#a1a1aa',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginTop: '4px',
              }}
            >
              Developer Code Library
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '32px',
            padding: '16px 28px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {['Syntax Highlighting', 'Tags & Search', 'Version History', 'Keyboard Shortcuts'].map(
            (tag) => (
              <span
                key={tag}
                style={{
                  fontSize: '16px',
                  color: '#d4d4d8',
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '6px',
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '60px',
            right: '60px',
            display: 'flex',
            justifyContent: 'center',
            gap: '32px',
            fontSize: '14px',
            color: '#52525b',
          }}
        >
          <span>⌘K Quick Search</span>
          <span>⌘N New Snippet</span>
          <span>⌘S Save</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
