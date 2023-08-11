import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { HiMoon, HiSun } from "react-icons/hi";

export const ThemeToggler = (props: IconButtonProps) => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<IconButton
			onClick={toggleColorMode}
			fontSize={"20"}
			icon={colorMode === "dark" ? <HiSun /> : <HiMoon />}
			_focus={{ outline: "none" }}
			{...props}
		/>
	);
};
