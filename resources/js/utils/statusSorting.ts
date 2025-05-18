export const statusSorting = (a: any, b: any) => {
    const order = { Assigned: 1, Ongoing: 2, Completed: 3};
    const aStatus = a.getValue("status") as keyof typeof order;
    const bStatus = b.getValue("status") as keyof typeof order;
    const aVal = order[aStatus] ?? 0;
    const bVal = order[bStatus] ?? 0;
    return aVal - bVal;
};