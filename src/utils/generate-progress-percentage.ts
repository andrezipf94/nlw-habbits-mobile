export function generateProgressPercentage(available: number, completed: number) {
    return Math.round((completed / available) * 100);
}