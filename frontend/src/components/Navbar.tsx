import { ReactNode } from "react";
import { Link as ReachLink } from "@reach/router";
import {
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
	Link,
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
	FiTrendingUp,
	FiCompass,
	FiStar,
	FiSettings,
	FiMenu,
	FiSun,
	FiMoon,
	FiMoreHorizontal,
} from "react-icons/fi";
import { IconType } from "react-icons";

interface LinkItemProps {
	name: string;
	path: string;
	icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
	{ name: "Home", path: "/", icon: FiHome },
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

const NavLink = (props: any) => {
	<ReachLink
		{...props}
		getProps={({ isCurrent }) => {
			return {
				style: {
					color: isCurrent ? "red" : "blue",
				},
			};
		}}
	/>;
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
					<Text
						fontSize="2xl"
						fontFamily="monospace"
						fontWeight="bold"
					>
						Budgeter
					</Text>
					<CloseButton
						display={{ base: "flex", lg: "none" }}
						onClick={onClose}
					/>
				</Flex>
				<Flex flexDirection={"column"} flex="1">
					{LinkItems.map((link) => (
						<NavItem
							key={link.name}
							icon={link.icon}
							path={link.path}
						>
							{link.name}
						</NavItem>
					))}
				</Flex>
				<Flex
					justifyContent={"space-between"}
					mb={{ base: 14, lg: 4 }}
					py="5"
					mx="8"
				>
					<IconButton
						onClick={toggleColorMode}
						aria-label="Theme toggler"
						icon={colorMode === "dark" ? <FiSun /> : <FiMoon />}
						_focus={{ outline: "none" }}
					/>
					<Menu closeOnSelect={true}>
						<MenuButton
							_focus={{ outline: "none" }}
							as={IconButton}
						>
							<FiMoreHorizontal style={{ margin: "auto" }} />
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
				</Flex>
			</Flex>
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: IconType;
	path: String;
	children: String;
}

const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
	return (
		<Link
			href={path as string}
			style={{ textDecoration: "none" }}
			_focus={{ boxShadow: "none" }}
		>
			<Flex
				align="center"
				p="4"
				mx="4"
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
		</Link>
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

			<Text
				fontSize="2xl"
				ml={{ base: 4, lg: 8 }}
				fontFamily="monospace"
				fontWeight="bold"
			>
				Budgeter
			</Text>
		</Flex>
	);
};
