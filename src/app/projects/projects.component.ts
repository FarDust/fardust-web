import { Component, OnInit } from '@angular/core';
import { ProjectsService, Project } from '../services/projects.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.sass']
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  filter = '';

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.projectsService.getProjects().subscribe(data => this.projects = data);
  }

  filteredProjects(): Project[] {
    const term = this.filter.toLowerCase();
    return this.projects.filter(p =>
      p.name.toLowerCase().includes(term) ||
      p.tags.some(t => t.toLowerCase().includes(term))
    );
  }
}
