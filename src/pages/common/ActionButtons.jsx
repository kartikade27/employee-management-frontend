import React from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";

const ActionButton = ({ icon, onClick, secondary, danger }) => {
  return (
    <button
      className={`btn btn-sm transition-transform transform hover:scale-105
      ${secondary ? "bg-secondary text-white hover:bg-secondary/90" : ""}
      ${danger ? "bg-error text-white hover:bg-error/90" : ""}
      ${!secondary && !danger ? "bg-primary text-white hover:bg-primary/90" : ""}
    `}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const ActionButtons = ({ onView, onEdit, onDelete, vertical }) => {
  return (
    <div className={`flex ${vertical ? "flex-col" : ""} gap-2 justify-center`}>
      {onView && <ActionButton icon={<Eye size={16} />} onClick={onView} />}

      {onEdit && (
        <ActionButton icon={<Pencil size={16} />} secondary onClick={onEdit} />
      )}

      {onDelete && (
        <ActionButton icon={<Trash2 size={16} />} danger onClick={onDelete} />
      )}
    </div>
  );
};

export default ActionButtons;