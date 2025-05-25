export const prioritySorting = (a: any, b: any) => {
    const order = { Low: 1, Medium: 2, High: 3, Critical: 4 };
    const aPriority = a.getValue("priority") as keyof typeof order;
    const bPriority = b.getValue("priority") as keyof typeof order;
    const aVal = order[aPriority] ?? 0;
    const bVal = order[bPriority] ?? 0;
    return aVal - bVal;
};