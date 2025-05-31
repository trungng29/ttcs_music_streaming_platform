import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

// Mô tả chức năng của component AuthProvider:
// Khi app khởi động, tự động lấy token, gắn vào axios, 
// trong lúc chờ thì show loading, xong thì render app.

// Khi có token thì nó thêm token vào headers mặc định của axiosInstance
// Nếu ko có token thì xóa luôn Authorization
const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// children là tất cả những component nằm bên trong AuthProvider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);

        if (token) {
          await checkAdminStatus(token);
        }
      } catch (error: any) {
        updateApiToken(null);
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Thêm interval để tự động refresh token
    const tokenRefreshInterval = setInterval(async () => {
      try {
        const token = await getToken();
        if (token) {
          updateApiToken(token);
          await checkAdminStatus(token);
        }
      } catch (error) {
        console.log("Error refreshing token", error);
      }
    }, 5 * 60 * 1000); // Refresh mỗi 5 phút

    return () => {
      clearInterval(tokenRefreshInterval);
    };
  }, [getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AuthProvider;
