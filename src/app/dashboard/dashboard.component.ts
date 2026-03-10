import { Component } from '@angular/core';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
}

interface ActivityItem {
  action: string;
  detail: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

interface ChartBar {
  label: string;
  value: number;
  height: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  sidebarCollapsed = false;
  currentPage = 'overview';

  stats: StatCard[] = [
    { title: 'Total Visitors', value: '24,563', change: '+12.5%', changeType: 'up', icon: '👥' },
    { title: 'Page Views', value: '87,241', change: '+8.3%', changeType: 'up', icon: '👁' },
    { title: 'Deployments', value: '142', change: '+3', changeType: 'up', icon: '🚀' },
    { title: 'Uptime', value: '99.98%', change: '0.00%', changeType: 'neutral', icon: '⚡' }
  ];

  weeklyTraffic: ChartBar[] = [
    { label: 'Mon', value: 3200, height: 64 },
    { label: 'Tue', value: 4100, height: 82 },
    { label: 'Wed', value: 3800, height: 76 },
    { label: 'Thu', value: 5000, height: 100 },
    { label: 'Fri', value: 4500, height: 90 },
    { label: 'Sat', value: 2800, height: 56 },
    { label: 'Sun', value: 2200, height: 44 }
  ];

  monthlyDeployments: ChartBar[] = [
    { label: 'Jan', value: 18, height: 60 },
    { label: 'Feb', value: 22, height: 73 },
    { label: 'Mar', value: 30, height: 100 },
    { label: 'Apr', value: 25, height: 83 },
    { label: 'May', value: 28, height: 93 },
    { label: 'Jun', value: 20, height: 67 }
  ];

  recentActivity: ActivityItem[] = [
    { action: 'Deploy succeeded', detail: 'Production — main@e5190c4', time: '2 min ago', status: 'success' },
    { action: 'Build started', detail: 'Preview — feature/dashboard', time: '15 min ago', status: 'info' },
    { action: 'DNS updated', detail: 'jazzy-frangollo-5269fa.netlify.app', time: '1 hour ago', status: 'info' },
    { action: 'Deploy succeeded', detail: 'Production — main@83ec2fd', time: '3 hours ago', status: 'success' },
    { action: 'Build warning', detail: 'Bundle size approaching limit', time: '5 hours ago', status: 'warning' },
    { action: 'Plugin installed', detail: '@netlify/plugin-angular', time: '1 day ago', status: 'info' },
    { action: 'SSL renewed', detail: 'Certificate auto-renewed', time: '2 days ago', status: 'success' },
    { action: 'Build failed', detail: 'Preview — fix/typo@a3f21b8', time: '3 days ago', status: 'error' }
  ];

  navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'deploys', label: 'Deploys', icon: '🚀' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'forms', label: 'Forms', icon: '📝' },
    { id: 'functions', label: 'Functions', icon: '⚙️' },
    { id: 'settings', label: 'Settings', icon: '🔧' }
  ];

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  navigateTo(page: string): void {
    this.currentPage = page;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }
}
