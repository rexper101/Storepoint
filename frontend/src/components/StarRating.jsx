export default function StarRating({ value = 0, onChange, size = 18, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div
      className="star-rating"
      role={readOnly ? 'img' : 'radiogroup'}
      aria-label={`Rating: ${value} out of 5`}
    >
      {stars.map((n) => (
        <button
          key={n}
          type="button"
          className={`star ${n <= Math.round(value) ? 'star-filled' : ''}`}
          style={{ width: size, height: size }}
          disabled={readOnly}
          onClick={() => onChange && onChange(n)}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6L12 2z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
