import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="absolute -inset-1 bg-blue-100 rounded-full blur"></div>
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-lg">
          <img
            src="https://scontent.fscl13-1.fna.fbcdn.net/v/t39.30808-1/453009623_2163452557366304_1904590804030137489_n.jpg?stp=dst-jpg_s200x200&_nc_cat=107&ccb=1-7&_nc_sid=0ecb9b&_nc_eui2=AeFF0qtjtxckb05xxP-UIVafPbIr-SU7dYc9siv5JTt1hzaseVAAJWz_fzqxSshEppAVt22PUVTL_M3Qpd3ZLePC&_nc_ohc=yp_rM_grEyUQ7kNvgGPHRZ-&_nc_zt=24&_nc_ht=scontent.fscl13-1.fna&_nc_gid=AJxPjBRbfzNUibrC8gQgNvu&oh=00_AYBEN9oDDP5BL8zB8tz07E9Uc3Dz_g859yBe8a5nrCG6aw&oe=674AF2A1"
            alt="Ditama Pañales"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          <span className="text-blue-600">Baby</span>
          <span className="text-gray-800">Diapers</span>
        </h1>
        <p className="text-xs text-gray-500 -mt-1">Tu tienda de confianza</p>
      </div>
    </div>
  );
};