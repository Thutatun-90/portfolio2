import type { AstroInstance } from 'astro';
import { Github, Instagram } from 'lucide-astro';

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
			name: 'GitHub',
			url: 'https://github.com/Thutatun-90',
			icon: Github,
		} as SocialLink,
		{
			name: 'Instagram',
			url: 'https://www.instagram.com/artist_kaung_kin/',
			icon: Instagram,
		} as SocialLink,
	],
};
