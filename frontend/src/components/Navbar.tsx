import { ReactNode } from "react";
import { Link as WouterLink, useLocation, useRoute } from "wouter";
import { IconType } from "react-icons";
import { useMutation } from "react-query";

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
	useToast,
	HStack,
	Image,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { RiCompassDiscoverFill } from "react-icons/ri";
import {
	HiBell,
	HiCog,
	HiHome,
	HiLogout,
	HiPlusCircle,
	HiUsers,
} from "react-icons/hi";

import viteSvg from "../../public/vite.svg";
import { axiosLogout } from "../utils";
import {
	NotificationsModal,
	QuickSettingsModal,
	NewExpenseModal,
	ThemeToggler,
} from "../components";

interface LinkItemProps {
	name: string;
	path: string;
	icon: IconType;
}

const LinkItems: Array<LinkItemProps> = [
	{ name: "Home", path: "/home", icon: HiHome },
	{ name: "Friends", path: "/friends", icon: HiUsers },
	{ name: "Discover", path: "/discover", icon: RiCompassDiscoverFill },
	{ name: "Settings", path: "/settings", icon: HiCog },
];

export function Navbar({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const toast = useToast();
	const [, setLocation] = useLocation();

	const mutation = useMutation({
		mutationFn: () => axiosLogout.post("/logout/"),
		onSuccess({ data }) {
			toast({
				title: "Logout Successful!",
				description: data.detail,
				status: "success",
				duration: 2500,
				isClosable: true,
			});
			setLocation("/");
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

	async function handleLogout() {
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
				logoutLoading={mutation.isLoading}
				onClose={() => onClose}
				handleLogout={handleLogout}
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
						logoutLoading={mutation.isLoading}
						onClose={onClose}
						handleLogout={handleLogout}
					/>
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav display={{ base: "flex", lg: "none" }} onOpen={onOpen} />
			<Box
				ml={{ base: 0, lg: 60 }}
				// py={{ base: 5, lg: 2 }}
			>
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
				fontWeight={isActive ? "bold" : "medium"}
				cursor="pointer"
				_hover={{
					bg: useColorModeValue("gray.900", "gray.700"),
					color: "white",
				}}
				{...rest}
			>
				{icon && (
					<Icon
						mr="3"
						fontSize="20"
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
	logoutLoading: boolean;
}

const SidebarContent = ({
	onClose,
	handleLogout,
	logoutLoading,
	...rest
}: SidebarProps) => {
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
						<HStack>
							<Image src={viteSvg} h="30px" />
							<Text fontSize="2xl" fontWeight="bold" fontFamily={"monospace"}>
								Budgeter
							</Text>
						</HStack>
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
							fontWeight={"semibold"}
							role="group"
							cursor="pointer"
							_hover={{
								bg: useColorModeValue("gray.900", "white"),
								color: "white",
								bgGradient: "linear(to-r, green.500, green.700)",
							}}
							shadow="base"
							onClick={() => newExpenseModal.onOpen()}
						>
							<Icon
								mr="3"
								fontSize="20"
								_groupHover={{
									color: "white",
								}}
								as={HiPlusCircle}
							/>
							Add Expense
						</Flex>
						{LinkItems.map((link) => (
							<NavLink key={link.name} icon={link.icon} path={link.path}>
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
						<ThemeToggler w={"full"} aria-label="Theme toggler" />
						<IconButton
							aria-label="notification-btn"
							icon={<HiBell />}
							fontSize={"20"}
							w={"full"}
							onClick={() => notificationsModal.onOpen()}
						/>
						<IconButton
							isLoading={logoutLoading}
							w={"full"}
							fontSize={"20"}
							aria-label="log-out-btn"
							icon={<HiLogout />}
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
			<HStack ml={{ base: 4, lg: 8 }}>
				<Image src={viteSvg} h="30px" />
				<Text fontSize="2xl" fontWeight="bold" fontFamily={"monospace"}>
					Budgeter
				</Text>
			</HStack>
		</Flex>
	);
};
