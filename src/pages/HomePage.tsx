import { observer } from "mobx-react-lite";
import { taskStore } from "../stores/TaskStore";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import {
    DndContext,
    closestCenter,
    useDraggable,
    useDroppable,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { TaskEditModal } from "../feture/TaskEditModal";
import { Link } from "react-router-dom";

// Компонент датчика для DnD с исключением определенных элементов
class CustomPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown" as const,
            handler: ({ nativeEvent: event }: { nativeEvent: PointerEvent }) => {
                if ((event.target as HTMLElement).closest("[data-no-dnd]")) {
                    return false;
                }
                return true;
            },
        },
    ];
}

// Форматирование даты
const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString() : "—";

// Главная страница приложения
export const HomePage = observer(() => {
    const { filteredRunningTasks, filteredCompletedTasks, loadTasks, isLoading } = taskStore;
    const [dragDisabled, setDragDisabled] = useState(false);

    // Настройка датчиков для DnD
    const sensors = useSensors(useSensor(CustomPointerSensor));

    // Загрузка задач при первом рендеринге
    useEffect(() => {
        loadTasks();
    }, []);

    // Обработчик окончания перетаскивания задачи
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || dragDisabled) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId !== overId) {
            setDragDisabled(true);
            try {
                const currentDate = new Date().toISOString();
                
                if (overId === "completed") {
                    console.log("Moving to completed with endDate:", currentDate);
                    await taskStore.updateTaskStatus(activeId, {
                        completed: true,
                        endDate: currentDate
                    });
                } else if (overId === "running") {
                    console.log("Moving to running, clearing endDate");
                    await taskStore.updateTaskStatus(activeId, {
                        completed: false,
                        endDate: undefined
                    });
                }
            } catch (error) {
                console.error("Error updating task status:", error);
            } finally {
                setDragDisabled(false);
            }
        }
    };

    // Отображение загрузки
    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#FFDDD2] flex items-center justify-center">
                <p className="text-xl text-[#006D77]">Загрузка...</p>
            </div>
        );
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <div className="min-h-screen bg-[#FFDDD2] flex flex-col items-center p-4">
                <h1 className="text-3xl font-bold text-[#006D77] mb-6">Task Manager</h1>
                <div className="flex w-full max-w-6xl space-x-0 space-y-6 md:space-y-0 md:space-x-8 flex-col md:flex-row">
                    <TaskList
                        id="running"
                        title="Running Tasks"
                        tasks={filteredRunningTasks}
                        dragDisabled={dragDisabled}
                        onDelete={taskStore.deleteTask}
                        linkTo="/all-running-tasks"
                        linkText="View All Running Tasks"
                    />
                    <div className="hidden md:block w-1 bg-[#006D77]"></div>
                    <TaskList
                        id="completed"
                        title="Completed Tasks"
                        tasks={filteredCompletedTasks}
                        dragDisabled={dragDisabled}
                        onDelete={taskStore.deleteTask}
                        linkTo="/all-completed-tasks"
                        linkText="View All Completed Tasks"
                    />
                </div>
            </div>
        </DndContext>
    );
});

// Компонент списка задач
export const TaskList = observer(({
    id,
    title,
    tasks,
    dragDisabled,
    onDelete,
    linkTo,
    linkText,
}: {
    id: string;
    title: string;
    tasks: any[];
    dragDisabled: boolean;
    onDelete: (id: string) => Promise<void>;
    linkTo: string;
    linkText: string;
}) => {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="flex-1 p-4 rounded-lg">
            <h2 className="text-2xl font-bold text-[#006D77] mb-4 text-center">{title}</h2>
            <div className="h-1 bg-[#006D77] rounded-full mb-4"></div>
            {tasks.length === 0 ? (
                <div className="text-center text-gray-500 italic py-8">Нет задач</div>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <DraggableTask
                            key={task.id}
                            task={task}
                            onDelete={onDelete}
                            disabled={dragDisabled}
                        />
                    ))}
                </div>
            )}
            <div className="mt-4 text-center">
                <Link
                    to={linkTo}
                    className="text-[#006D77] text-sm font-medium hover:underline"
                >
                    {linkText}
                </Link>
            </div>
        </div>
    );
});

// Компонент перетаскиваемой задачи
export const DraggableTask = observer(({
    task,
    onDelete,
    disabled,
}: {
    task: any;
    onDelete: (id: string) => Promise<void>;
    disabled: boolean;
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        disabled: disabled || isProcessing || isModalOpen,
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
              cursor: disabled || isProcessing || isModalOpen ? "default" : "grab",
          }
        : undefined;

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (isProcessing) return;
        setIsProcessing(true);
        try {
            await onDelete(task.id);
        } catch (error) {
            console.error("Error deleting task:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setIsModalOpen(true);
    };

    // Если задача перетаскивается в completed, но у неё нет endDate, установим его
    useEffect(() => {
        const updateEndDateIfNeeded = async () => {
            if (task.completed && !task.endDate) {
                console.log(`Setting missing endDate for completed task ${task.id}`);
                try {
                    await taskStore.updateTask(task.id, {
                        endDate: new Date().toISOString()
                    });
                } catch (error) {
                    console.error("Error updating endDate:", error);
                }
            }
        };
        
        updateEndDateIfNeeded();
    }, [task.completed, task.endDate, task.id]);

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                {...(disabled || isProcessing || isModalOpen ? {} : attributes)}
                {...(disabled || isProcessing || isModalOpen ? {} : listeners)}
                className={`bg-[#006D77] shadow-md rounded-lg p-4 flex relative ${
                    disabled || isProcessing || isModalOpen ? "opacity-70" : "cursor-grab active:cursor-grabbing"
                }`}
            >
                <div className="flex-1 text-[#FFDDD2]">
                    <h3 className="text-lg font-bold">{task.title}</h3>
                    {task.description && (
                        <p className="text-sm mt-1 opacity-90">{task.description}</p>
                    )}
                    <div className="flex flex-col mt-2 text-sm">
                        <span>Создано: {formatDate(task.createdAt)}</span>
                        {task.startDate && <span>Начало: {formatDate(task.startDate)}</span>}
                        {task.completed && (
                            <span>
                                Завершено: {task.endDate ? formatDate(task.endDate) : formatDate(new Date().toISOString())}
                            </span>
                        )}
                        {task.priority && <span>Приоритет: {task.priority}</span>}
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center ml-3 space-y-3">
                    <button data-no-dnd className="cursor-pointer">
                        <FaInfoCircle className="text-[#FFDDD2] text-xl" />
                    </button>
                    <button
                        data-no-dnd
                        onClick={handleEdit}
                        disabled={isProcessing}
                        className="cursor-pointer"
                    >
                        <FaEdit className="text-[#FFDDD2] text-lg" />
                    </button>
                    <button
                        data-no-dnd
                        onClick={handleDelete}
                        disabled={isProcessing}
                        className="cursor-pointer"
                    >
                        <FaTrash className="text-[#FFDDD2] text-lg" />
                    </button>
                </div>
                {isProcessing && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg pointer-events-none">
                        <div className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                            Удаление...
                        </div>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <TaskEditModal
                    task={task}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </>
    );
});