import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import SongPage from "./pages/song/SongPage";
import SearchPage from "./pages/Search/SearchPage";
import AdminPage from "./pages/admin/AdminPage";
import LikedSongsPage from "./pages/liked-songs/LikedSongsPage";
import PlaylistPage from "./pages/playlist/PlaylistPage";
import ArtistPage from "./pages/artist/ArtistPage";
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/sso-callback"
          element={
            <AuthenticateWithRedirectCallback
              signUpForceRedirectUrl={"/auth-callback"}
            />
          }
        />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path='/albums/:albumId' element={<AlbumPage />} />
          <Route path='/songs/:songId' element={<SongPage />} />
          <Route path='/liked-songs' element={<LikedSongsPage />} />
          <Route path='/playlists/:playlistId' element={<PlaylistPage />} />
          <Route path='/artists/:artistId' element={<ArtistPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
