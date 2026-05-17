export default function Modal({ title, onClose, onConfirm, children }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <h3>{title}</h3>
        {children}
        <div className="form-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
