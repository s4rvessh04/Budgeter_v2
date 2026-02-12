export function handleDefault<T>(value: T, defaultValue: T) {
	if (!value) {
		return defaultValue;
	} else {
		return value;
	}
}

export function handleColorModeValue(
	light: string,
	dark: string,
	colorModeInstance: "light" | "dark"
): string {
	if (colorModeInstance === "dark") return dark;
	else return light;
}
