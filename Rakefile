#require "bundler/gem_tasks"
require "rake/testtask"

Rake::TestTask.new(:test) do |t|
  t.libs << "spec/ruby"
  t.libs << "lib"
  t.test_files = FileList['spec/ruby/**/*_test.rb']
end

task :default => :test
