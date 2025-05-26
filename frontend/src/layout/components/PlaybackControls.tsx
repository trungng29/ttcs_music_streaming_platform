import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { useUserStore } from "@/stores/useUserStore";
import { useUser } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import { toast, Toaster } from "sonner";
import { Laptop2, ListMusic, Mic2, Pause, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume1, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { currentSong, isPlaying, togglePlay, playNext, playPrevious } = usePlayerStore();
	const { likeSong, unlikeSong } = useMusicStore();
	const { user: clerkUser } = useUser();
	const { user, fetchUser } = useUserStore();
	const { getToken } = useAuth();
	const userId = clerkUser?.id;
	const likedSongs = user?.likedSongs || [];
	const [loadingLike, setLoadingLike] = useState(false);

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			usePlayerStore.setState({ isPlaying: false });
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong]);

	useEffect(() => {
		if (userId) {
			const fetchUserWithToken = async () => {
				const token = await getToken();
				if (token) {
					await fetchUser(userId, token);
				}
			};
			fetchUserWithToken();
		}
	}, [userId, fetchUser, getToken]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	const handleLike = async () => {
		if (!userId || !currentSong) return;
		try {
			setLoadingLike(true);
			const token = await getToken();
			if (!token) {
				toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
				return;
			}

			const isLiked = likedSongs.includes(currentSong._id);
			if (isLiked) {
				await unlikeSong(token, currentSong._id);
				toast.success(`Đã xóa "${currentSong.title}" khỏi bài hát yêu thích`);
			} else {
				await likeSong(token, currentSong._id);
				toast.success(`Đã thêm "${currentSong.title}" vào bài hát yêu thích`);
			}
			const decoded: any = jwtDecode(token);
			await fetchUser(decoded.sub, token);
		} catch (error: any) {
			if (error?.response?.status === 401) {
				toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
			} else {
				toast.error("Có lỗi xảy ra khi thao tác với bài hát yêu thích");
			}
		} finally {
			setLoadingLike(false);
		}
	};

	return (
		<>
			<Toaster richColors position="top-center" />
			<footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
				<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
					{/* currently playing song */}
					<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
						{currentSong && (
							<>
								<img
									src={currentSong.imageUrl}
									alt={currentSong.title}
									className='w-14 h-14 object-cover rounded-md'
								/>
								<div className='flex items-center gap-6'>
									<div className='flex-1 min-w-0'>
										<div className='font-medium truncate hover:underline cursor-pointer'>
											{currentSong.title}
										</div>
										<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
											{currentSong.artist}
										</div>
									</div>
									<Button
										onClick={handleLike}
										size='icon'
										variant='ghost'
										className='hover:scale-105 transition-all'
										disabled={loadingLike}
									>
										<Heart
											className={`h-5 w-5 ${
												likedSongs.includes(currentSong._id) ? 'text-green-500 fill-green-500' : 'text-white'
											}`}
										/>
									</Button>
								</div>
							</>
						)}
					</div>

					{/* player controls*/}
					<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
						<div className='flex items-center gap-4 sm:gap-6'>
							<Button
								size='icon'
								variant='ghost'
								className='hidden sm:inline-flex hover:text-white text-zinc-400'
							>
								<Shuffle className='h-4 w-4' />
							</Button>

							<Button
								size='icon'
								variant='ghost'
								className='hover:text-white text-zinc-400'
								onClick={playPrevious}
								disabled={!currentSong}
							>
								<SkipBack className='h-4 w-4' />
							</Button>

							<Button
								size='icon'
								className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
								onClick={togglePlay}
								disabled={!currentSong}
							>
								{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
							</Button>
							<Button
								size='icon'
								variant='ghost'
								className='hover:text-white text-zinc-400'
								onClick={playNext}
								disabled={!currentSong}
							>
								<SkipForward className='h-4 w-4' />
							</Button>
							<Button
								size='icon'
								variant='ghost'
								className='hidden sm:inline-flex hover:text-white text-zinc-400'
							>
								<Repeat className='h-4 w-4' />
							</Button>
						</div>

						<div className='hidden sm:flex items-center gap-2 w-full'>
							<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								className='w-full hover:cursor-grab active:cursor-grabbing'
								onValueChange={handleSeek}
							/>
							<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
						</div>
					</div>
					{/* volume controls */}
					<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Mic2 className='h-4 w-4' />
						</Button>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<ListMusic className='h-4 w-4' />
						</Button>
						<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
							<Laptop2 className='h-4 w-4' />
						</Button>

						<div className='flex items-center gap-2'>
							<Button size='icon' variant='ghost' className='hover:text-white text-zinc-400'>
								<Volume1 className='h-4 w-4' />
							</Button>

							<Slider
								value={[volume]}
								max={100}
								step={1}
								className='w-24 hover:cursor-grab active:cursor-grabbing'
								onValueChange={(value) => {
									setVolume(value[0]);
									if (audioRef.current) {
										audioRef.current.volume = value[0] / 100;
									}
								}}
							/>
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};
