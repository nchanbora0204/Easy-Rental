export const ErrorMessage = ({ msg }) => {
  if (!msg) return null;

  return (
    <div className="card mb-4 bg-red-50 border-red-200">
      <div className="card-body text-red-700 text-sm">{msg}</div>
    </div>
  );
};
