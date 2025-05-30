import { useAuthStore } from "@/stores/useAuthStore";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Music, Users } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import UsersTabContent from "./components/UsersTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";
import AddSongDialog from "./components/AddSongDialog";
import AddAlbumDialog from "./components/AddAlbumDialog";

const AdminPage = () => {
	const { isAdmin, isArtist, isLoading, checkAdminStatus } = useAuthStore();
	const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore();

	useEffect(() => {
		checkAdminStatus();
	}, [checkAdminStatus]);

	useEffect(() => {
		fetchAlbums();
		fetchSongs();
		if (isAdmin) {
			fetchStats();
		}
	}, [fetchAlbums, fetchSongs, fetchStats, isAdmin]);

	if ((!isAdmin && !isArtist) && !isLoading) return <div>Unauthorized</div>;

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-8'
		>
			<Header />

			{isAdmin && <DashboardStats />}

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='p-1 bg-zinc-800/50'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
					{isAdmin && (
						<TabsTrigger value='users' className='data-[state=active]:bg-zinc-700'>
							<Users className='mr-2 size-4' />
							Users
						</TabsTrigger>
					)}
				</TabsList>

				<TabsContent value='songs'>
					<div className="flex justify-end mb-4">
						<AddSongDialog />
					</div>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<div className="flex justify-end mb-4">
						<AddAlbumDialog />
					</div>
					<AlbumsTabContent />
				</TabsContent>
				{isAdmin && (
					<TabsContent value='users'>
						<UsersTabContent />
					</TabsContent>
				)}
			</Tabs>
		</div>
	);
};
export default AdminPage;
