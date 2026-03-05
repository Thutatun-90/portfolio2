import type { AstroInstance } from 'astro';
import { Github, Instagram, Facebook } from 'lucide-astro';

export interface SocialLink {
	name: string;
	url: string;
	icon: AstroInstance;
}

export default {
	title: 'Kaung Kin',
	favicon: 'favicon.ico',
	owner: 'Kaung Kin',
	profileImage: 'profile.jpg',
	socialLinks: [
		{
			name: 'Instagram',
			url: 'https://www.instagram.com/artist_kaung_kin/',
			icon: Instagram,
		} as SocialLink,
		{
			name: 'Facebook',
			url: 'https://www.facebook.com/cartoon.kaungkin',
			icon: Facebook,
		} as SocialLink,
	],
};
