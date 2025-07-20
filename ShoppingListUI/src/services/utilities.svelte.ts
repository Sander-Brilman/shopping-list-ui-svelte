

export function daysUntilChristmas() {
    const today = new Date();
    const christmas = new Date(today.getFullYear(), 11, 25);
    if (today > christmas) christmas.setFullYear(christmas.getFullYear() + 1);
    return ((christmas.valueOf() - today.valueOf()) / (1000 * 60 * 60 * 24)).toFixed(4);
}

export function galacticYearsUntilChristmas(): string {
    const now = new Date();
    const thisYear = now.getFullYear();
    const christmasDate = new Date(`${thisYear}-12-25T00:00:00`);
    if (now > christmasDate) {
        christmasDate.setFullYear(thisYear + 1);
    }
    const millisecondsUntilChristmas = christmasDate.getTime() - now.getTime();
    const yearsUntilChristmas = millisecondsUntilChristmas / (1000 * 60 * 60 * 24 * 365.25);
    const galacticYears = yearsUntilChristmas / 225_000_000;
    return galacticYears.toExponential(5);
}

export const allThemes = [
    "Firebrick",
    "Rebeccapurple",
    "DarkSlateBlue",
    "Darkgreen",
];

let selectedTheme = $state(localStorage.getItem("selectedTheme") ?? allThemes[0]);
selectTheme(selectedTheme);

export function selectTheme(theme: string) {
    selectedTheme = theme;
    document.querySelector("body")?.setAttribute("class", selectedTheme.toLowerCase());
    localStorage.setItem("selectedTheme", selectedTheme);
}

export function getSelectedTheme() {
    return selectedTheme;
}