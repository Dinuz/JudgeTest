class CreateInviteRequests < ActiveRecord::Migration
  def change
    create_table :invite_requests do |t|
      t.string :email
      t.boolean :invite_sent, :null => false, :default => false

      t.timestamps null: false
    end
  end
end
