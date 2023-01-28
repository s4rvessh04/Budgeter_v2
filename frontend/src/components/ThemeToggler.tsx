import { IconButton, IconButtonProps, useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export const ThemeToggler = (props: IconButtonProps) => {
	const { colorMode, toggleColorMode } = useColorMode();
	return (
		<IconButton
			onClick={toggleColorMode}
			icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
			_focus={{ outline: "none" }}
			{...props}
		/>
	);
};
