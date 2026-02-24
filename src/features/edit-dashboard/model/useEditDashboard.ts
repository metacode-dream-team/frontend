import { useState } from "react";
import { useDashboardStore, type DashboardWidgetType, type WidgetConfig } from "@/entities/dashboard";

function moveItem(items: WidgetConfig[], fromId: string, toId: string): WidgetConfig[] {
  const fromIndex = items.findIndex((item) => item.id === fromId);
  const toIndex = items.findIndex((item) => item.id === toId);

  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return items;
  }

  const next = [...items];
  const [dragged] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, dragged);

  return next;
}

export function useEditDashboard() {
  const { layout, updateLayout, addWidget, removeWidget, updateWidgetSize } = useDashboardStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const toggleEditMode = () => setIsEditMode((prev) => !prev);

  const onDragStart = (id: string) => setDraggingId(id);

  const onDropOn = (targetId: string) => {
    if (!draggingId || !isEditMode) {
      setDraggingId(null);
      return;
    }

    updateLayout(moveItem(layout, draggingId, targetId));
    setDraggingId(null);
  };

  const onAddWidget = (type: DashboardWidgetType) => addWidget(type);

  return {
    layout,
    isEditMode,
    draggingId,
    toggleEditMode,
    onDragStart,
    onDropOn,
    onAddWidget,
    onRemoveWidget: removeWidget,
    onResizeWidget: updateWidgetSize,
  };
}
