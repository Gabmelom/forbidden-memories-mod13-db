export type CardFactIconName = 'sword' | 'shield' | 'store' | 'starchip'

export function CardFactIcon({ name }: { name: CardFactIconName }) {
  if (name === 'starchip') {
    return (
      <img
        className="card-fact-icon card-fact-icon-starchip"
        src={`${import.meta.env.BASE_URL}misc/starchip.png`}
        alt=""
        aria-hidden="true"
      />
    )
  }

  const icons = {
    sword: {
      viewBox: '0 0 640 640',
      path: <path d="M304 448L352 496L320 528L208 480L160 528L160 576L128 608L32 512L64 480L112 480L160 432L112 320L144 288L192 336L480 48L592 48L592 160L304 448zM270.1 414.1L544 140.2L544 96.1L499.9 96.1L226 370L270.1 414.1z" />,
    },
    shield: {
      viewBox: '0 0 640 640',
      path: <path d="M320 113.4L137.1 191C131.2 193.5 128 198.8 128.1 203.8C128.6 295.2 166.5 453.1 314.5 523.9C318.1 525.6 322.3 525.6 325.8 523.9C473.8 453.1 511.7 295.2 512.1 203.8C512.1 198.8 509 193.6 503.1 191L320 113.4zM333.4 66.9L521.8 146.8C543.8 156.1 560.2 177.8 560.1 204C559.6 303.2 518.8 484.7 346.5 567.2C329.8 575.2 310.4 575.2 293.7 567.2C121.3 484.7 80.5 303.2 80.1 204C80 177.8 96.4 156.1 118.4 146.8L306.7 66.9C310.9 65 315.4 64 320 64C324.6 64 329.2 65 333.4 66.9z" />,
    },
    store: (
      {
        viewBox: '0 0 24 24',
        path: (
          <>
            <path d="M4 10v10h16V10M3 10l2-6h14l2 6" />
            <path d="M3 10a3 3 0 0 0 5 2 3 3 0 0 0 4 0 3 3 0 0 0 4 0 3 3 0 0 0 5-2M9 20v-5h6v5" />
          </>
        ),
      }
    ),
  }
  const icon = icons[name]
  const isFilled = name === 'sword' || name === 'shield'

  return (
    <svg
      className={`card-fact-icon card-fact-icon-${name}`}
      viewBox={icon.viewBox}
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icon.path}
    </svg>
  )
}
