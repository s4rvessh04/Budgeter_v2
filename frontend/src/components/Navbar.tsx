import { ReactNode } from "react";
import { Link as WouterLink, useLocation, useRoute } from "wouter";
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
	useToast,
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
	FiDollarSign,
} from "react-icons/fi";
import { IconType } from "react-icons";
import {
	NotificationsModal,
	QuickSettingsModal,
	NewExpenseModal,
} from "../components";
import { useMutation } from "react-query";
import { axiosLogout } from "../utils";

interface LinkItemProps {
	name: string;
	path: string;
	icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
	// { name: "New Expense", path: "/new", icon: FiPlus },
	{ name: "Home", path: "/home", icon: FiHome },
	{ name: "Friends", path: "/friends", icon: FiUsers },
	{ name: "Expenses", path: "/expenses", icon: FiDollarSign },
	{ name: "Settings", path: "/settings", icon: FiSettings },
];

export function Navbar({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [, setLocation] = useLocation();

	const mutation = useMutation({
		mutationFn: () => axiosLogout.post("/logout/"),
		onSuccess() {
			setLocation("/home");
		},
		onError(err) {
			if (err instanceof Error) {
				toast({
					title: "Error Occured!",
					description: err.message,
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			}
		},
	});

	async function handleLogut() {
		// const res = await axiosLogout.post("/logout/");
		// console.log(res);
		// if (res.statusText == "OK") {
		// 	setLocation("/home");
		// } else {
		// 	toast({
		// 		title: "Error Occured!",
		// 		description: String("Error"),
		// 		status: "error",
		// 		duration: 9000,
		// 		isClosable: true,
		// 	});
		// }
		mutation.mutate();
	}

	return (
		<Box
			minH="100vh"
			minW="100vw"
			maxH="100vh"
			maxW="100vh"
			overflow="auto"
			bg={useColorModeValue("gray.100", "gray.900")}
		>
			<SidebarContent
				onClose={() => onClose}
				handleLogout={handleLogut}
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
					<SidebarContent
						onClose={onClose}
						handleLogout={handleLogut}
					/>
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
	handleLogout: () => void;
}

const SidebarContent = ({ onClose, handleLogout, ...rest }: SidebarProps) => {
	const { colorMode, toggleColorMode } = useColorMode();

	const notificationsModal = useDisclosure();
	const quickSettingsModal = useDisclosure();
	const newExpenseModal = useDisclosure();

	return (
		<>
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
						<Flex
							style={{
								textDecoration: "none",
							}}
							color={useColorModeValue("white", "white")}
							bg={useColorModeValue("green.500", "green.700")}
							_focus={{ boxShadow: "none" }}
							align="center"
							p="4"
							mx="4"
							mb="2"
							borderRadius="lg"
							role="group"
							cursor="pointer"
							_hover={{
								bg: useColorModeValue("gray.900", "white"),
								color: "white",
								bgGradient:
									"linear(to-r, green.500, green.700)",
							}}
							shadow="base"
							onClick={() => newExpenseModal.onOpen()}
						>
							<Icon
								mr="4"
								fontSize="16"
								_groupHover={{
									color: "white",
								}}
								as={FiPlus}
							/>
							Add Expense
						</Flex>
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
							onClick={() => notificationsModal.onOpen()}
						/>
						<IconButton
							aria-label="notification-btn"
							icon={<FiTool />}
							w={"full"}
							onClick={() => quickSettingsModal.onOpen()}
						/>
						<IconButton
							w={"full"}
							aria-label="log-out-btn"
							icon={<FiLogOut />}
							colorScheme="red"
							onClick={handleLogout}
						/>
					</Flex>
				</Flex>
			</Box>
			<NotificationsModal
				onClose={notificationsModal.onClose}
				isOpen={notificationsModal.isOpen}
			/>
			<QuickSettingsModal
				onClose={quickSettingsModal.onClose}
				isOpen={quickSettingsModal.isOpen}
			/>
			<NewExpenseModal
				onClose={newExpenseModal.onClose}
				isOpen={newExpenseModal.isOpen}
			/>
		</>
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
