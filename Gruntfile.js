module.exports = function(grunt) {
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    secret: grunt.file.readJSON("secret.json"),
    watch: {
      scss: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass:dev', 'postcss', 'copy', 'ssh_deploy:production']
      },
      config: {
        options: {
          reload: true
        },
        files: ['package.json', 'Gruntfile.js', 'secret.json'],
        tasks: ['startup']
      }
    },
    sass: {
      dev: {
        options: {
          style: 'expanded',
          noCache: true,
          update: true,
          sourcemap: 'none'
        },
        files: [{
          expand: true, 
          cwd: 'src/scss', 
          src: ['*.scss'], 
          dest: 'dist/css', 
          ext: '.css'
        }]
      },
      dist: {
        options: {
          style: 'condensed',
          noCache: true,
          sourcemap: 'none',
        },
        files: [{
          expand: true, 
          cwd: 'src/scss', 
          src: ['*.scss'], 
          dest: 'dist/css', 
          ext: '.css'
        }]
      }
    },
    environments: {
      production: {
        options: {
          tag: '<%= pkg.version %>',
          host: '<%= secret.production.host %>',
          username: '<%= secret.production.username %>',
          password: '<%= secret.production.password %>',
          port: '<%= secret.production.port %>',
          local_path: '<%= secret.production.local_path %>',
          deploy_path: '<%= secret.production.deploy_path %>'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')({browsers: 'last 2 versions'})
        ]
      },
      dist: {
        src: 'dist/css/*.css'
      }
    },
    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/css/',
          src: ['*.css', '!*.min.css'],
          dest: '/dist/css/',
          ext: '.min.css'
        }]
      }
    },
    copy: {
      assets: {
        files: [
          {expand: true, cwd: 'src', src: ['fonts/**/*'], dest: 'dist/'}
        ]
      }
    },
    clean: {
      dist: ['dist/']
    }
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-postcss');
  grunt.loadNpmTasks('grunt-ssh-deploy');
  
  grunt.registerTask('startup', [
    'clean:dist',
    'sass:dev',
    'postcss',
    'copy',
    'ssh_deploy:production'
  ]);
  grunt.registerTask('dev', [
    'startup',
    'watch'
  ]);
  grunt.registerTask('dist', [
    'clean:dist',
    'sass:dist',
    'postcss',
    'cssmin',
    'ssh_deploy:production'
  ]);
  grunt.registerTask('default', ['dev']);
  
};