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
        