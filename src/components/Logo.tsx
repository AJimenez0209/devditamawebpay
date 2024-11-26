import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="relative">
        <div className="absolute -inset-1 bg-blue-100 rounded-full blur"></div>
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-600 shadow-lg">
          <img
            src="https://i.ibb.https://instagram.fscl13-1.fna.fbcdn.net/v/t51.2885-19/453522625_1380197132880427_7599713530620507518_n.jpg?stp=dst-jpg_s150x150_tt6&_nc_ht=instagram.fscl13-1.fna.fbcdn.net&_nc_cat=107&_nc_ohc=Wk72lvZM49kQ7kNvgEJpyuS&_nc_gid=9f9b6e28a31c45eab7670855d22b491e&edm=AP4sbd4BAAAA&ccb=7-5&oh=00_AYBUAE6tB4ymwwluz75P3tBHsHUEqMOJTnlJ72HTG_11ng&oe=674AEC32&_nc_sid=7a9f4b/VvLNYZz/LOGO-DITAMA.jpg"
            alt="Ditama Logo"
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