// frontend/src/components/SectionSidebar.jsx
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function SectionSidebar({
  sections,
  onSelect,
  selectedKey,
  onRename,
  onMove,
  onMerge,
  onDelete,
  onReorder,
}) {
  const keys = Object.keys(sections);

  function handleDragEnd(result) {
    if (!result.destination) return;
    const reordered = Array.from(keys);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    onReorder(reordered);
  }

  return (
    <div style={{ width: "320px", borderRight: "1px solid #ccc", overflowY: "auto", background: "#f7f8fa" }}>
      <div style={{ padding: 12, borderBottom: "1px solid #ddd", fontWeight: "bold", background: "#fff" }}>
        Sections
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} style={{ padding: 8 }}>
              {keys.map((key, index) => (
                <Draggable key={key} draggableId={key} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="sidebar-item"
                      style={{
                        padding: 10,
                        margin: "6px 8px",
                        borderRadius: 6,
                        background: key === selectedKey ? "#e8f0fe" : "#fff",
                        boxShadow: snapshot.isDragging ? "0 2px 8px rgba(0,0,0,0.2)" : "0 0 1px rgba(0,0,0,0.1)",
                        cursor: "grab",
                        ...provided.draggableProps.style,
                      }}
                      onClick={() => onSelect(key)}
                    >
                      <div style={{ fontWeight: "bold" }}>{key}</div>
                      <div style={{ marginTop: 6, display: "flex", gap: 8 }}>
                        <button onClick={(e) => { e.stopPropagation(); onRename(key); }}>✏️</button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(key); }}>🗑️</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ padding: 12, borderTop: "1px solid #ddd", background: "#fff" }}>
        <button onClick={onMerge}>Merge Sections</button>
      </div>
    </div>
  );
}
