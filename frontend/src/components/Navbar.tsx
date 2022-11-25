import { ReactNode } from "react";
import { Link as WouterLink, useRoute } from "wouter";
import {
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	useColorMode,
	Menu,
	MenuButton,
	MenuList,
	MenuOptionGroup,
	MenuItemOption,
} from "@chakra-ui/react";
import {
	FiHome,
	FiUsers,
	FiSettings,
	FiMenu,
	FiSun,
	FiMoon,
	FiPlus,
	FiTool,
	FiLogOut,
	FiBell,
} from "react-icons/fi";
import { IconType } from "react-icons";

interface LinkItemProps {
	name: string;
	path: string;
	icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
	{ name: "New Expense", path: "/new", icon: FiPlus },
	{ name: "Home", path: "/", icon: FiHome },
	{ name: "Friends", path: "/friends", icon: FiUsers },
	{ name: "Settings", path: "/settings", icon: FiSettings },
];

export function Navbar({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<Box
			minH="100vh"
			minW="100vw"
			bg={useColorModeValue("gray.100", "gray.900")}
		>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: "none", lg: "block" }}
			/>
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full"
			>
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav display={{ base: "flex", lg: "none" }} onOpen={onOpen} />
			<Box ml={{ base: 0, lg: 60 }} py={{ base: 5, lg: 2 }}>
				{children}
			</Box>
		</Box>
	);
}

interface NavItemProps extends FlexProps {
	icon: IconType;
	path: string;
	children: String;
}

const NavLink = ({ icon, path, children, ...rest }: NavItemProps) => {
	const [isActive] = useRoute(path);

	return (
		<WouterLink href={path}>
			<Flex
				style={{
					textDecoration: "none",
				}}
				bg={isActive ? useColorModeValue("gray.900", "gray.700") : ""}
				color={isActive ? "white" : useColorModeValue("black", "white")}
				_focus={{ boxShadow: "none" }}
				align="center"
				p="4"
				mx="4"
				mb="2"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: useColorModeValue("gray.900", "gray.700"),
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: "white",
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</WouterLink>
	);
};

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	const { colorMode, toggleColorMode } = useColorMode();

	return (
		<Box
			bg={useColorModeValue("white", "gray.900")}
			borderRight="1px"
			borderRightColor={useColorModeValue("gray.200", "gray.700")}
			w={{ base: "full", lg: 60 }}
			pos="fixed"
			h={"full"}
			{...rest}
		>
			<Flex flexDirection={"column"} h="full">
				<Flex
					py="5"
					alignItems="center"
					mx="8"
					justifyContent="space-between"
				>
					<Text fontSize="2xl" fontWeight="bold">
						Budgeter
					</Text>
					<CloseButton
						display={{ base: "flex", lg: "none" }}
						onClick={onClose}
					/>
				</Flex>
				<Flex flexDirection={"column"} flex="1">
					{LinkItems.map((link) => (
						<NavLink
							key={link.name}
							icon={link.icon}
							path={link.path}
						>
							{link.name}
						</NavLink>
					))}
				</Flex>
				<Flex
					justifyContent={"space-around"}
					mb={{ base: 14, lg: 4 }}
					py="5"
					px={{ base: "4", lg: "4" }}
					gap={4}
				>
					<IconButton
						onClick={toggleColorMode}
						aria-label="Theme toggler"
						icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
						_focus={{ outline: "none" }}
						w={"full"}
					/>

					<IconButton
						aria-label="notification-btn"
						icon={<FiBell />}
						w={"full"}
					/>
					<Menu closeOnSelect={true}>
						<MenuButton
							w={"full"}
							_focus={{ outline: "none" }}
							as={IconButton}
						>
							<FiTool style={{ margin: "auto" }} />
						</MenuButton>
						<MenuList minWidth="240px" p="1" mb={3.5}>
							<MenuOptionGroup
								defaultValue="all-time"
								title="Select data time"
								type="radio"
							>
								<MenuItemOption
									value="all-time"
									_focus={{ outline: "none" }}
								>
									All Time
								</MenuItemOption>
								<MenuItemOption
									value="curr-month"
									_focus={{ outline: "none" }}
								>
									Current Month
								</MenuItemOption>
							</MenuOptionGroup>
						</MenuList>
					</Menu>
					<IconButton
						w={"full"}
						aria-label="log-out-btn"
						icon={<FiLogOut />}
						colorScheme="red"
					/>
				</Flex>
			</Flex>
		</Box>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex
			ml={{ base: 0, lg: 60 }}
			px={{ base: 2, md: 4, lg: 24 }}
			py={5}
			alignItems="center"
			bg={useColorModeValue("white", "gray.900")}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue("gray.200", "gray.700")}
			justifyContent="flex-start"
			{...rest}
		>
			<IconButton
				variant="outline"
				onClick={onOpen}
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Text fontSize="2xl" ml={{ base: 4, lg: 8 }} fontWeight="bold">
				Budgeter
			</Text>
		</Flex>
	);
};
